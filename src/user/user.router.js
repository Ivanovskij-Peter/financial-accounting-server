const { Router } = require("express");
const { asyncWrapper } = require("../helpers/asyncWrapper");
const { getMonthIncomes, getMonthCosts } = require("./user.controller");
const router = Router();

router.get("/user");

router.patch();

router.get("/incomes", asyncWrapper(getMonthIncomes));
router.get("/costs", asyncWrapper(getMonthCosts));

// router.patch();

module.exports = router;
