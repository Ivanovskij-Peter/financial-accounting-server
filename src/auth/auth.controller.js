
const fs = require("fs")
const path = require('path');
const {unlink} = fs.promises;

const bcrypt = require("bcryptjs");
const {v4: uuidv4} = require("uuid");
const Avatar = require("avatar-builder");
const minifyImage = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const cloudinary = require('cloudinary').v2;
const sgMail = require("@sendgrid/mail");
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const { HttpCodes } = require('../helpers/constants');
const User = require("../User/User");

async function registerUser(req, res) {
  const {body} = req

  const hashedPassword = await bcrypt.hash(body.password, 14)
  const tokenToVerify = await uuidv4()

  const isEmailExist = await User.findOne({
    email: body.email,
  })
  if (isEmailExist) {
    return res.status(409).send({message: "Email in use"})
  }
  const avatarTitle = Date.now()
  const avatar = Avatar.builder(Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())), 128, 128, {
    cache: Avatar.Cache.lru(),
  })
    .create(body)
    .then((buffer) => fs.writeFileSync(`tmp/${avatarTitle}.png`, buffer))


  const files = await minifyImage([`tmp/${avatarTitle}.png`], {
    destination: "public/images",
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  })

  const [ava] = files;
    console.log(ava);

  // let avatarURL = '';
  
  //           await cloudinary.uploader.upload(ava.destinationPath, function (error, result) {
  //               avatarURL = result.secure_url;
  //           });
    
            // await unlink(`tmp/${avatarTitle}.png`);
            // await unlink(path.join(__dirname, `public/images/${avatarTitle}.png`))

  // console.log(avatarURL);  

  const user = await User.create({
    ...body,
    // avatarURL,
    password: hashedPassword,
    verificationToken: tokenToVerify,
  })

  if (!user) {
    return res.status(500).send({message: 'Something went wrong'})
  }

  await sendVerificationEmail(body.email, tokenToVerify)

  res.status(201).json({
    user
  })
}

async function sendVerificationEmail(email, verificationToken) {
  const msg = {
    to: email, // Change to your recipient
    from: "team1node@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    html: `Thank you for registration. To verify your email, click 
    <a href="http://localhost:${process.env.PORT}/auth/verify/${verificationToken}">here</a>`,
  }
  await sgMail.send(msg)
  .then(res => console.log(res))
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email
  })

  if (!user) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not autorized"})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not autorized"}) 
  }

  const token = jwt.sign({
    userID: user._id,
  }, process.env.JWT_SECRET);

  await User.findOneAndUpdate({ email }, { $set: { token } }, {
    new: true
  })

  return res.status(HttpCodes.CREATED).json(user)
}

async function validationUser(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  })

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(HttpCodes.BAD_REQUEST).json({"message":validationResult.error.details[0].message})
  }
  next();
}

async function authorization(req, res, next) {
  const header = req.get('Authorization');
  if (!header) {
  return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not autorized"})
  }
  
  const token = header.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const { userID } = payload;
  const user = await User.findById(userID);

  if (!user) {
       return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }
  
  req.user = user;
  next()

}

module.exports = {
  validationUser,
  loginUser,
  authorization,
  registerUser,
}

