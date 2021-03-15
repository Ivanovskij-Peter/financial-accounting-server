const { HttpCodes } = require('../helpers/constants');
const jwt = require('jsonwebtoken');
const User = require('../user/User');
const { registerUserSchema, loginUserSchema } = require("./auth.shemes");
async function validateRegistration(req, res, next) {
  const validationResult = registerUserSchema.validate(req.body);

  if (validationResult.error) {
    return res
      .status(HttpCodes.BAD_REQUEST)
      .json({ message: validationResult.error.details[0].message });
  }
  next();
}

async function validateLogin(req, res, next) {
  const validationResult = loginUserSchema.validate(req.body);

  if (validationResult.error) {
    return res
      .status(HttpCodes.BAD_REQUEST)
      .json({ message: validationResult.error.details[0].message });
  }
  next();
}
async function authorization(req, res, next) {
  const header = req.get("Authorization");
  if (!header) {
    return res
      .status(HttpCodes.NOT_AUTORIZED)
      .json({ message: "Not autorized" });
  }

  const token = header.replace("Bearer ", "");

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const { userID } = payload;
  const user = await User.findById(userID);

  if (!user) {
    return res
      .status(HttpCodes.NOT_AUTORIZED)
      .json({ message: "Not authorized" });
  }

  req.user = user;
  req.token = token;
  next();
}
module.exports = {
  authorization,
  validateRegistration,
  validateLogin,
};
