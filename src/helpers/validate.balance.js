const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.validateBalance = Joi.object({
  balance: Joi.number().required().min(1),
});
