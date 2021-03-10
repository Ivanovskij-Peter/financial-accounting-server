const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
