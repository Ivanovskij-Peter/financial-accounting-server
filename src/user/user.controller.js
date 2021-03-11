
const User = require("./User");

exports.getMonthIncomes = async (req, res, next) => {
  const user = req.user;

  const monthesArr = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  function getMonthFromString(str) {
    return new Date(str).getMonth();
  }

  user.operations.incomes
    .sort((a, b) => getMonthFromString(a.date) - getMonthFromString(b.date))
    .map((item) => ({
      date: monthesArr[+item.date.slice(0, 2) - 1],
      amount: item.amount,
    }))
    .reduce((acc, curr) => {
      if (!acc.some((el) => el.date === curr.date)) {
        acc.push(curr);
      } else {
        const neededArr = acc.find((el) => el.date === curr.date);
        neededArr.amount += curr.amount;
      }
      return acc;
    }, []);

  return res
    .status(200)
    .send({ user: { operations: user.operations.incomes } });
};

exports.getMonthCosts = async (req, res, next) => {
  const user = req.user;

  const monthesArr = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  function getMonthFromString(str) {
    return new Date(str).getMonth();
  }

  user.operations.costs
    .sort((a, b) => getMonthFromString(a.date) - getMonthFromString(b.date))
    .map((item) => ({
      date: monthesArr[+item.date.slice(0, 2) - 1],
      amount: item.amount,
    }))
    .reduce((acc, curr) => {
      if (!acc.some((el) => el.date === curr.date)) {
        acc.push(curr);
      } else {
        const neededArr = acc.find((el) => el.date === curr.date);
        neededArr.amount += curr.amount;
      }
      return acc;
    }, []);

  return res.status(200).send({ user: { operations: user.operations.costs } });
};
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