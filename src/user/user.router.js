const { Router } = require("express");

/**
 * @swagger
 * /incomes:
 *   get:
 *     description: Get user's incomes
 *     tags: [Transactions]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /costs:
 *   get:
 *     description: Get user's costs and expences
 *     tags: [Transactions]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

 /**
 * @swagger
 * /information:
 *   get:
 *     description: Get information
 *     tags: [Transactions]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

  /**
 * @swagger
 * /incomes:
 *   patch:
 *     description: Add user's incomes
 *     tags: [Transactions]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

  /**
 * @swagger
 * /costs:
 *   patch:
 *     description: Add user's expenses
 *     tags: [Transactions]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

  /**
 * @swagger
 * /incomes:
 *   delete:
 *     description: Delete user's incomes
 *     tags: [Transactions]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

  /**
 * @swagger
 * /costs:
 *   delete:
 *     description: Delete user's expenses
 *     tags: [Transactions]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

const asyncWrapper = require("../helpers/asyncWrapper");
const {
  deleteIncome,
  deleteCosts,
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
router.delete("/incomes", authorization, asyncWrapper(deleteIncome));
router.delete("/costs", authorization, asyncWrapper(deleteCosts));

module.exports = router;
