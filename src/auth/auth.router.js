const { Router } = require('express');

const router = Router();

const asyncWrapper = require('../helpers/asyncWrapper');
const {
  validationUser,
  loginUser,
  authorization,
  registerUser,
  logoutUser,
} = require('./auth.controller');

/**
 * @swagger
 * /register:
 *   post:
 *     description: Registration of new user
 *     tags: [User]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

router.post(`/register`, validationUser, asyncWrapper(registerUser));

/**
 * @swagger
 * /login:
 *   post:
 *     description: Log in
 *     tags: [User]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */

router.post('/login', validationUser, asyncWrapper(loginUser));
/**
 * @swagger
 * /logout:
 *   post:
 *     description: Log Out
 *     tags: [User]
 *     responses: 
 *       200: 
 *         description: Success
 *       500:
 *         description: Server error
 */


router.post('/logout', authorization, asyncWrapper(logoutUser));

module.exports = router;
