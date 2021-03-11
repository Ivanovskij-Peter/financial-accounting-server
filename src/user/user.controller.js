const User = require("./User");

exports.getMonthIncomes = async (req, res, next) => {
  await User.findOne(req.user._id);
  return res.status(200).send({ user: { operations: user.incomes } });
};
exports.getMonthCosts = async (req, res, next) => {
  await User.findOne(req.user._id);
  return res.status(200).send({ user: { operations: user.costs } });
};
