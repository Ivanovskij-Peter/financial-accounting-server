const { Router } = require("express");
const asyncWrapper = require("../helpers/asyncWrapper");
const { getMonthIncomes, getMonthCosts, getMonthInformation } = require("./user.controller");
const { authorization } = require('../auth/auth.controller');
const router = Router();


router.get("/incomes", asyncWrapper(getMonthIncomes));
router.get("/costs", asyncWrapper(getMonthCosts));
router.get("/information",authorization, asyncWrapper(getMonthInformation));


module.exports = router;
