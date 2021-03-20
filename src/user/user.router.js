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
  getCurrentUser,
  getOperations,
  getIncomes,
  getCosts,
} = require("./user.controller");
const { authorization } = require("../auth/auth.middleware");
const { validateBalance } = require("../helpers/validate.balance");
const { validate } = require("../helpers/validate.middleware");
const router = Router();

router.get("/", authorization, asyncWrapper(getCurrentUser));
router.patch(
  "/balance",
  validate(validateBalance),
  authorization,
  asyncWrapper(updateBalance),
);
router.get("/monthincomes", authorization, asyncWrapper(getMonthIncomes));
router.get("/monthcosts", authorization, asyncWrapper(getMonthCosts));

router.get("/incomes", authorization, asyncWrapper(getIncomes));
router.get("/costs", authorization, asyncWrapper(getCosts));
router.get(
  "/information/:date",
  authorization,
  asyncWrapper(getMonthInformation),
);
router.get("/operations", authorization, asyncWrapper(getOperations));
router.post("/incomes", authorization, asyncWrapper(userIncome));
router.post("/costs", authorization, asyncWrapper(userCosts));
router.delete("/incomes/:id", authorization, asyncWrapper(deleteIncome));
router.delete("/costs/:id", authorization, asyncWrapper(deleteCosts));

module.exports = router;
