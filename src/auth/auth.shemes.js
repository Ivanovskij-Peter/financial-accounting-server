const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const registerUserSchema = Joi.object({
  name: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().max(16),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().max(16),
});

const logoutUserSchema = Joi.object({
  refreshToken: Joi.string().required()
})

module.exports = {
  registerUserSchema,
  loginUserSchema,
  logoutUserSchema
};
