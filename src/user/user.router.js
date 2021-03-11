const { Router } = require("express");
const asyncWrapper = require("../helpers/asyncWrapper");
const { getMonthIncomes, getMonthCosts } = require("./user.controller");
const { authorization } = require("../auth/auth.controller");
const router = Router();

// router.get("/user");

router.get("/incomes", authorization, asyncWrapper(getMonthIncomes));
router.get("/costs", asyncWrapper(getMonthCosts));

// router.patch();

module.exports = router;
