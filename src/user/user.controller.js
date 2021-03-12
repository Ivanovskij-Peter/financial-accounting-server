const { HttpCodes } = require("../helpers/constants");
const User = require("./User");

async function getMonthIncomes(req, res, next) {
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
  const incomesArr = user.operations.costs;
  const formatedIncomes = incomesArr
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
    .send({ user: { operations: { costs: formatedIncomes } } });
}

async function getMonthInformation(req, res) {
  const { date } = req.body;
  const user = await User.findOne(req.user._id);

  const year = date.split("-")[0];
  const month = date.split("-")[1];

  const yearCostsArr = user.operations.costs.filter(
    (el) => year === el.date.split("-")[2],
  );

  const monthCostsArr = yearCostsArr.filter(
    (el) => month === el.date.split("-")[1],
  );

  const totalCosts = monthCostsArr.reduce(
    (acc, el) => acc + Number(el.amount),
    0,
  );

  const costs = {
    total: totalCosts,
  };

  monthCostsArr.forEach((el) => {
    if (costs[el.category]) {
      if (costs[el.category][el.description]) {
        const price = +costs[el.category][el.description] + +el.amount;
        costs[el.category][el.description] = price;
      } else
        costs[el.category] = {
          ...costs[el.category],
          [el.description]: el.amount,
        };
    } else
      costs[el.category] = {
        ...costs[el.category],
        [el.description]: el.amount,
      };
  });

  for (let cost in costs) {
    if (cost !== "total") {
      const costObj = costs[cost];
      if (!costObj.total) {
        costObj.total = 0;
      }
      for (let descr in costObj) {
        const price = costObj[descr]

        if (descr !== 'total') {
          costObj.total = costObj.total + price
        }
      }
    }
  }

  console.log(costs);

  res.status(HttpCodes.OK).json(costs);
}
async function getMonthCosts(req, res, next) {
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
  const costsArr = user.operations.costs;
  const formatedCost = costsArr
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
    .send({ user: { operations: { costs: formatedCost } } });
}

async function userIncome(req, res) {
  const { user } = req;
  const { body: income } = req;
  // const incomes = [...user.operation.incomes];
  const total = 0;

  const incomes = incomes.forEach((el) => {
    if (el.category === income.category) {
      total += el.amount;
    }
  });

  incomes = [...incomes, income];

  user.incomes = incomes;
  const updatedUser = await User.findByIdAndUpdate(user._id, user, {
    new: true,
  });

  return res
    .send({
      categoryTotal: total,
    })
    .status(201);
}

async function userCosts(req, res) {
  const { user } = req;
  const { body: cost } = req;
  // const costs = [...user.operation.costs];
  const total = 0;

  costs = [...costs, cost];

  const costs = costs.forEach((el) => {
    if (el.category === cost.category) {
      total += el.amount;
    }
  });

  user.costs = costs;
  const updatedUser = await User.findByIdAndUpdate(user._id, user, {
    new: true,
  });

  return res
    .send({
      categoryTotal: total,
    })
    .status(201);
}

module.exports = {
  userIncome,
  userCosts,
  getMonthCosts,
  getMonthIncomes,
  getMonthInformation,
};
