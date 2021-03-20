const fs = require("fs");
const { unlink } = fs.promises;
const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const Avatar = require("avatar-builder");
const minifyImage = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const cloudinary = require("cloudinary").v2;
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

const { HttpCodes } = require("../helpers/constants");
const User = require("../user/User");
const MailVerification = require("./models/MailVerification");

async function logoutUser(req, res) {
  const { _id } = req.user;
  const userById = await User.findByIdAndUpdate(_id, { token: null });

  if (!userById) {
    return res.status(401).send("Not authorized");
  }

  return res.status(204).send();
}

const generateVerificationToken = async (uid) => {
  const token = await crypto.randomBytes(16).toString('hex');
  return await MailVerification.create({token, uid})
}

const sendVerificationEmail = async (email, token) => {

  const API_URL = 'https://kapusta-srv.herokuapp.com/auth/mail-verify'
  const msg = {
      to: email,
      from: 'team1node@gmail.com',
      subject: 'Email confirmation',
      html: `<h1>Welcome to our application</h1>
      <p>We need you to verify your email, if you registered at Kapu$ta application, please follow this link:</p>
      <a href="${API_URL}/${token}">verify email</a>`,
  }

  await sgMail.send(msg);
  console.log('Email sent')
}

async function registerUser(req, res) {
  const { body } = req;

  const hashedPassword = await bcrypt.hash(body.password, 14);


  const ifExistingUser = await User.findOne({
    email: body.email,
  });

  if (ifExistingUser) {
    return res.status(409).send({ message: "Email in use" });
  }
  const avatarTitle = Date.now();
  Avatar.builder(
    Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())),
    128,
    128,
    {
      cache: Avatar.Cache.lru(),
    },
  )
    .create(body)
    .then((buffer) => fs.writeFileSync(`tmp/${avatarTitle}.png`, buffer));

  const files = await minifyImage([`tmp/${avatarTitle}.png`], {
    destination: "public/images",
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  const [ava] = files;

  let avatarURL = "";
  await cloudinary.uploader.upload(
    ava.destinationPath,
    function (error, result) {
      avatarURL = result.secure_url;
    },
  );

  await unlink(`tmp/${avatarTitle}.png`);
  await unlink(ava.destinationPath);

  const tokenToVerify = await generateVerificationToken();
  await sendVerificationEmail(body.email, tokenToVerify);

  const createdUser = await User.create({
    ...body,
    avatarURL,
    password: hashedPassword,
    verificationToken: tokenToVerify,
    balance: 0,
  });
  
  const data = {
    id: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
  };
  res.status(201).json(data);
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res
      .status(HttpCodes.NOT_FOUND)
      .json({ message: "Authentification is failed" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(HttpCodes.NOT_FOUND)
      .json({ message: "Authentification is failed" });
  }

  const token = jwt.sign(
    {
      userID: user._id,
    },
    process.env.JWT_SECRET,
  );

  await User.findOneAndUpdate(user.id, { push: { token: token } });
  return res.status(HttpCodes.CREATED).json({
    token,
    user: {
      email,
      name: user.name,
      avatarURL: user.avatarURL,
      balance: user.balance,
    },
  });
}

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const tokenRecord = await MailVerification.findOne({ token })
  
  if (!tokenRecord) {
      return res.status(404).json({"message": "Verification token invalid"});
  }

  const user = await User.findByIdAndUpdate(tokenRecord.uid, )
  if (!user) {
      return res.status(404).json({"message": "User not found"});
  }
  const APP_FE_URL = "http://localhost:3000";
  user.isVerified = true;

  await user.save()
  await MailVerification.findByIdAndDelete(tokenRecord._id);

  res.send(`<h1> Your email has been verified </h1>
  To continue follow this <a href="${APP_FE_URL}">link</a>
  `);
}

const refreshToken = async (req, res) => {
  const {
      token
  } = req.body;

  if (!token) {
      return res.status(401).json({ "message": "Not authorized" })
  }
  const { id } = await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
  if (!id) {
      return res.status(403).json({ "message": "Token is invalid" })
  }
  const user = await User.findById(id);
  if (!user) {
      return res.status(403).json({ "message": "Token is invalid" })
  }
  if (!user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ "message": "Token is invalid" })
  }
  const newAcessToken = this.generateAccessToken({ id });
  const newRefreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET);
  
  user.refreshTokens.push(newRefreshToken);
  if (user.refreshTokens.length >= 6) user.refreshTokens.pop();
  
  await this.updateUser(user._id, user, res);
  return res.json({ "acessToken": newAcessToken, "refreshToken": newRefreshToken, user: { id: user._id } });
}

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail
};
