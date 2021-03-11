const User = require("./User");

exports.getMonthIncomes = async (req, res, next) => {
 const user = await User.findOne(req.user._id);
  return res.status(200).send({ 'user': { 'operations': user.incomes } });
};
exports.getMonthCosts = async (req, res, next) => {
 const user = await User.findOne(req.user._id);
  return res.status(200).send({ 'user': { 'operations': user.costs } });
};

exports.getMonthInformation = async (req, res) => {
  const { date } = req.body;
  // const user = await User.findOne(req.user._id);

  const year = date.split('-')[0];
  console.log(year);
}
