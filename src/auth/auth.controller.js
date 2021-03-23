const fs = require("fs");
const { unlink } = fs.promises;
const crypto = require("crypto");
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
const VerificationToken = require("./models/MailVerification");
const RefreshToken = require("./models/RefreshToken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function logoutUser(req, res) {
  const { _id } = req.user;
  const { refreshToken } = req.body;

  const userById = await User.findByIdAndUpdate(_id, { token: null });
  if (refreshToken) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }
  if (!userById) {
    return res.status(401).send("Not authorized");
  }

  return res.status(204).send();
}

const generateVerificationToken = async (uid) => {
  const token = await crypto.randomBytes(16).toString("hex");
  await VerificationToken.create({ token, uid });
  return token;
};

const generateAccessToken = async (uid) => {
  return (token = jwt.sign(
    {
      userID: uid,
    },
    process.env.JWT_SECRET,
    { expiresIn: "60m" },
  ));
};
const generateRefreshToken = async (uid) => {
  return (token = jwt.sign(
    {
      userID: uid,
    },
    process.env.JWT_REFRESH_SECRET,
  ));
};

const sendVerificationEmail = async (email, token) => {
  const API_URL = "https://kapusta-srv.herokuapp.com/auth/mail-verify";
  const LOCAL_URL = "http://localhost:8080/auth/mail-verify";
  const msg = {
    to: email,
    from: "team1node@gmail.com",
    subject: "Email confirmation",
    html: `<h1>Welcome to our application</h1>
      <p>We need you to verify your email, if you registered at Kapu$ta application, please follow this link:</p>
      <a href="${API_URL}/${token}">verify email</a>`,
  };

  await sgMail.send(msg);
  console.log("Email sent");
};

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

  const createdUser = await User.create({
    ...body,
    avatarURL,
    password: hashedPassword,
    balance: 0,
  });

  const tokenToVerify = await generateVerificationToken(createdUser._id);
  await sendVerificationEmail(body.email, tokenToVerify);

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

  const token = await generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);
  const refresh = await RefreshToken.create({ token: refreshToken });

  return res.status(HttpCodes.CREATED).json({
    token,
    refreshToken,
    user: {
      email,
      name: user.name,
      avatarURL: user.avatarURL,
      balance: user.balance,
      isVerified: user.isVerified
    },
  });
}

const loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    const user = await User.findOne({ email });

    if (!user) {
      const createdUser = await User.create({
        email,
        name,
        isVerified: true,
        password: "auth from google",
        avatarURL: picture,
        balance: 0,
      });

      const accessToken = await generateAccessToken(createdUser._id);
      const refreshToken = await generateRefreshToken(createdUser._id);
      const refresh = await RefreshToken.create({ token: refreshToken });

      const data = {
        token: accessToken,
        refreshToken,
        user: {
          email: createdUser.email,
          name: createdUser.name,
          avatarURL: createdUser.avatarURL,
          balance: createdUser.balance,
        },
      };

      return res.status(201).json(data);
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    const refresh = await RefreshToken.create({ token: refreshToken });

    return res.status(200).json({
      token: accessToken,
      refreshToken,
      user: {
        email,
        name: user.name,
        avatarURL: user.avatarURL,
        balance: user.balance,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const tokenRecord = await VerificationToken.findOne({ token });

  if (!tokenRecord) {
    return res.status(404).json({ message: "Verification token invalid" });
  }

  const user = await User.findById(tokenRecord.uid);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const APP_FE_URL = "http://localhost:3000";
  user.isVerified = true;

  await user.save();
  await VerificationToken.findByIdAndDelete(tokenRecord._id);

  res.send(`<h1> Your email has been verified </h1>
  To continue follow this <a href="${APP_FE_URL}">link</a>
  `);
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const { userID } = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );
    const existingRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });
    if (!existingRefreshToken) {
      return res.status(403).json({ message: "Token is invalid" });
    }
    const newAcessToken = await generateAccessToken(userID);
    return res.json({ token: newAcessToken });
  } catch (error) {
    return res.status(403).json({ message: "Token is invalid" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail,
  refreshToken,
  loginWithGoogle,
};
