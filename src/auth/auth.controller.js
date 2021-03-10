const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Joi = require('joi');
const { HttpCodes } = require('../helpers/constants');
const User = require('../user/User');

dotenv.config();

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

module.exports = {
  validationUser,
  loginUser
}