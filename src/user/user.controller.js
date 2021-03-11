const User = require('./User');

async function userIncome(req, res) {
    const {user} = req;
    const {body: income} = req;
    const incomes = [...user.operation.incomes];
    const total = 0;

    const incomes = incomes.forEach(el => {
        if(el.category === income.category) {
            total += el.amount;
        }
    });

    incomes = [...incomes, income];

    user.incomes = incomes;
    const updatedUser = await User.findByIdAndUpdate(user._id, user, {new: true});

    return res.send({
        categoryTotal: total
    }).status(201)

};

async function userCosts(req, res) {
    const {user} = req;
    const {body: cost} = req;
    const costs = [...user.operation.costs];
    const total = 0;

    costs = [...costs, cost];

    const costs = costs.forEach(el => {
        if(el.category === cost.category) {
            total += el.amount;
        }
    });

    user.costs = costs;
    const updatedUser = await User.findByIdAndUpdate(user._id, user, {new: true});

    return res.send({
        categoryTotal: total
    }).status(201)

};

module.exports = {
    userIncome,
    userCosts
};
const User = require("./User");

exports.getMonthIncomes = async (req, res, next) => {
  await User.findOne(req.user._id);
  return res.status(200).send({ user: { operations: user.incomes } });
};
exports.getMonthCosts = async (req, res, next) => {
  await User.findOne(req.user._id);
  return res.status(200).send({ user: { operations: user.costs } });
};
