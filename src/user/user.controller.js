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
