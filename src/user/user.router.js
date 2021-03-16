const { Router } = require("express");

const asyncWrapper = require("../helpers/asyncWrapper");
const {
  deleteIncome,
  deleteCosts,
  userIncome,
  userCosts,
  getMonthIncomes,
  getMonthCosts,
  getMonthInformation,
  updateBalance,
} = require("./user.controller");
const { authorization } = require("../auth/auth.middleware");
const router = Router();
router.patch("/balance", authorization, asyncWrapper(updateBalance));
router.get("/incomes", authorization, asyncWrapper(getMonthIncomes));
router.get("/costs", authorization, asyncWrapper(getMonthCosts));
router.get(
  "/information/:date",
  authorization,
  asyncWrapper(getMonthInformation),
);
router.patch("/incomes", authorization, asyncWrapper(userIncome));
router.patch("/costs", authorization, asyncWrapper(userCosts));
router.delete("/incomes/:id", authorization, asyncWrapper(deleteIncome));
router.delete("/costs/:id", authorization, asyncWrapper(deleteCosts));

module.exports = router;
