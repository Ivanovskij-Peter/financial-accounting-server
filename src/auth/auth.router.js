const { Router } = require("express");
const router = Router();
const {
  authorization,
  validateRegistration,
  validateLogin,
  validateRefreshToken
} = require("./auth.middleware");
const asyncWrapper = require("../helpers/asyncWrapper");
const {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail,
  refreshToken
} = require("./auth.controller");

router.post("/register", validateRegistration, asyncWrapper(registerUser));
router.post("/login", validateLogin, asyncWrapper(loginUser));
router.post("/logout", authorization, asyncWrapper(logoutUser));
router.get("/mail-verify/:token", asyncWrapper(verifyEmail));
router.post("/refresh-token", validateRefreshToken, asyncWrapper(refreshToken));

module.exports = router;
