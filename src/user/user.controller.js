const User = require("./User");
// const seriolazeUser = require("./user.seriolaze");

exports.getMonthIncomes = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });
  await User.aggregate([
    {
      $project: { operations: 1 },
    },
    { $unwind: "$operations" },
    { $match: { "operations.incomes": { $exists: true } } },
  ]);
  return res.status(200).send({ user: { operations: user.operations:{incomes} } });
};
// exports.getMonthCosts = async (req, res, next) => {
//   await User.findOne(req.user._id);
//   return res.status(200).send({ user: { operations: user.costs } });
// };
