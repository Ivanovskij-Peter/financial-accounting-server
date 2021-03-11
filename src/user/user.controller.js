const { HttpCodes } = require("../helpers/constants");
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
  const user = await User.findOne(req.user._id);

  const year = date.split('-')[0];
  const month = date.split('-')[1];

  const yearCostsArr = user.operations.costs.filter(el => year === el.date.split('-')[0]);
  
  const monthCostsArr = yearCostsArr.filter(el => month === el.date.split('-')[1])
  
  const totalCosts = monthCostsArr.reduce((acc, el) => acc + Number(el.amount), 0 )
  
  const costs = {
    total: totalCosts,
  }
  
monthCostsArr.forEach(el => {
  if (costs[el.category]) {
    if (costs[el.category][el.description]) {
      const price = +costs[el.category][el.description] + +el.amount;
      costs[el.category][el.description] = price;
  } else costs[el.category] = {...costs[el.category],[el.description]: el.amount }
  } else costs[el.category] = {
     ...costs[el.category],
    [el.description]: el.amount 
    }
  
  }
  )
      
      console.log(costs);
  


  res.status(HttpCodes.OK).json(user)
}
