const fs = require("fs")

const bcrypt = require("bcryptjs");
const {v4: uuidv4} = require("uuid");
const Avatar = require("avatar-builder");
const minifyImage = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const cloudinary = require('cloudinary').v2;
const sgMail = require("@sendgrid/mail");
const {unlink} = fs.promises;
const path = require('path');

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


module.exports = {
  registerUser,
}
