const { Router } = require("express");
const  asyncWrapper  = require("../helpers/asyncWrapper");
const { getMonthIncomes, getMonthCosts } = require("./user.controller");
const router = Router();




/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *     - "user"
 *     summary: returns user
 *     responses: 
 *       200: 
 *         description: Successful operation
 *       500:
 *         description: Server error
 */

router.get("/user");

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

router.get("/incomes", asyncWrapper(getMonthIncomes));


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

router.get("/costs", asyncWrapper(getMonthCosts));

// router.patch();

module.exports = router;
