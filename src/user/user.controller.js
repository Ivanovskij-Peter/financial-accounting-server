const asyncWrapper = require("../helpers/asyncWrapper");
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
  const incomesArr = user.operations.incomes;
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

  return res.status(200).json({ incomes: formatedIncomes });
}

async function getMonthInformation(req, res) {
  // form of date MM-DD-YYYY
  const { date } = req.params;
  const user = await User.findOne(req.user._id);

  const year = date.split("-")[2];
  const month = date.split("-")[0];

  const yearCostsArr = user.operations.costs.filter(
    (el) => year === el.date.split(".")[2],
  );

  const monthCostsArr = yearCostsArr.filter(
    (el) => month === el.date.split(".")[1],
  );

  const totalCosts = monthCostsArr.reduce(
    (acc, el) => acc + Number(el.amount),
    0,
  );
  console.log("user.operations.costs", user.operations.costs);
  console.log("month", month);
  console.log("monthCostsArr", monthCostsArr);
  // console.log("user", user);
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
        const price = costObj[descr];

        if (descr !== "total") {
          costObj.total = costObj.total + price;
        }
      }
    }
  }

  const costsArr = [];

  for (let cost in costs) {
    const name = `${cost}`;
    const obj = {};
    costs[cost].total ? (obj.total = costs[cost].total) : "";
    costs[cost].total ? (obj.name = name) : "";

    Object.keys(obj).length > 0 ? costsArr.push(obj) : "";
  }

  const yearIncomesArr = user.operations.incomes.filter(
    (el) => year === el.date.split(".")[2],
  );

  const monthIncomesArr = yearIncomesArr.filter(
    (el) => month === el.date.split(".")[0],
  );

  const totalIncomes = monthIncomesArr.reduce(
    (acc, el) => acc + Number(el.amount),
    0,
  );

  const incomes = {
    total: totalIncomes,
  };

  monthIncomesArr.forEach((el) => {
    if (incomes[el.category]) {
      if (incomes[el.category][el.description]) {
        const price = +incomes[el.category][el.description] + +el.amount;
        incomes[el.category][el.description] = price;
      } else
        incomes[el.category] = {
          ...incomes[el.category],
          [el.description]: el.amount,
        };
    } else
      incomes[el.category] = {
        ...incomes[el.category],
        [el.description]: el.amount,
      };
  });

  for (let income in incomes) {
    if (income !== "total") {
      const incomeObj = incomes[income];
      if (!incomeObj.total) {
        incomeObj.total = 0;
      }
      for (let descr in incomeObj) {
        const price = incomeObj[descr];

        if (descr !== "total") {
          incomeObj.total = incomeObj.total + price;
        }
      }
    }
  }

  const incomesArr = [];

  for (let income in incomes) {
    const name = `${income}`;
    const obj = {};
    incomes[income].total ? (obj.total = incomes[income].total) : "";
    incomes[income].total ? (obj.name = name) : "";

    Object.keys(obj).length > 0 ? incomesArr.push(obj) : "";
  }

  res.status(HttpCodes.OK).json({
    costs: costs,
    incomes: incomes,
    costsArr,
    incomesArr,
  });
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
  const { body } = req;
  let incomes = [...user.operations.incomes, body];

  user.operations.incomes = [...incomes];
  user.balance += body.amount; //какое поле приходит с фронтенда

  await user.save();

  return res
    .send({
      body,
      balance: user.balance,
    })
    .status(201);
}

async function deleteIncome(req, res) {
  const {
    params: { id },
  } = req;
  const { user } = req;
  let incomes = [...user.operations.incomes];
  const deletedIncomes = incomes.filter((el) => el._id.toString() !== id);
  user.operations.incomes = deletedIncomes;
  await user.save();

  return res.send("It's OK").status(200);
}

async function deleteCosts(req, res) {
  const {
    params: { id },
  } = req;
  const { user } = req;
  let costs = [...user.operations.costs];
  deletedCosts = costs.filter((el) => el._id.toString() !== id);
  user.operations.costs = deletedCosts;

  await user.save();

  return res.send("It's OK").status(200);
}

async function userCosts(req, res) {
  const { user } = req;
  const { body } = req;
  let costs = [...user.operations.costs, body];

  user.operations.costs = [...costs];
  user.balance -= body.amount;

  await user.save();

  return res
    .send({
      body,
      balance: user.balance,
    })
    .status(201);
}

async function updateBalance(req, res) {
  const { balance } = req.body;
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { balance } },
    { new: true },
  );
  res.status(200).send({ balance });
}

const getCurrentUser = (req, res) => {
  const { user } = req;
  res.status(200).json({
    // token: user.token,
    email: user.email,
    name: user.name,
    avatarURL: user.avatarURL,
    balance: user.balance,
  });
};

async function getOperations(req, res) {
  const { user } = req;
  res.status(200).json({
    operations: user.operations,
  });
}

async function getIncomes(req, res) {
  const { user } = req;
  res.status(200).json({
    incomes: user.operations.incomes,
  });
}
async function getCosts(req, res) {
  const { user } = req;
  res.status(200).json({
    costs: user.operations.costs,
  });
}

module.exports = {
  deleteIncome,
  deleteCosts,
  userIncome,
  userCosts,
  getMonthCosts,
  getMonthIncomes,
  getMonthInformation,
  updateBalance,
  getCurrentUser,
  getOperations,
  getIncomes,
  getCosts,
};
