const { Router } = require("express");

const router = Router();

const asyncWrapper = require("../helpers/asyncWrapper");
const {
  validationUser,
  loginUser,
  authorization,
  registerUser,
  logoutUser,
} = require("./auth.controller");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: Registration of new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: Leanne Graham 
 *     responses: 
 *       200: 
 *         description: Successful registration       
 *       500:
 *         description: Server error

 * /auth/login:
 *   post:
 *     description: Log in
 *     tags: [User]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error

 * /auth/logout:
 *   post:
 *     description: Log Out
 *     tags: [User]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */


router.post("/register", validationUser, asyncWrapper(registerUser));
router.post("/login", validationUser, asyncWrapper(loginUser));
router.post("/logout", authorization, asyncWrapper(logoutUser));

module.exports = router;
