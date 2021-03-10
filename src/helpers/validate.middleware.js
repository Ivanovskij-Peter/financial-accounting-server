exports.validate = (schema, reqPart = "body") => {
  return (req, res, next) => {
    const validationRresult = schema.validate(req[reqPart]);
    if (validationRresult.error) {
      return res.status(400).send(validationRresult.error);
    }
    next();
  };
};
