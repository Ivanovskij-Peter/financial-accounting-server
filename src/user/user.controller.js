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

};

async function userCosts(req, res) {
    const {user} = req;
    const {body: cost} = req;
    const costs = [...user.operation.costs];
    const total = 0;

    costs = [...costs, cost];

    const costs = costs.forEach(el => {
        total += el.amount;
    });

    user.costs = costs;
    const updatedUser = await User.findByIdAndUpdate(user._id, user, {new: true});

};

module.exports = {
    userIncome,
    userCosts
};