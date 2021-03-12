const { Router } = require("express");
const asyncWrapper = require("../helpers/asyncWrapper");
const {
  userIncome,
  userCosts,
  getMonthIncomes,
  getMonthCosts,
  getMonthInformation,
} = require("./user.controller");
const { authorization } = require("../auth/auth.controller");
const router = Router();

router.get("/incomes", authorization, asyncWrapper(getMonthIncomes));
router.get("/costs", authorization, asyncWrapper(getMonthCosts));
router.get("/information", authorization, asyncWrapper(getMonthInformation));
router.patch("/incomes", authorization, asyncWrapper(userIncome));
router.patch("/costs", authorization, asyncWrapper(userCosts));

module.exports = router;
