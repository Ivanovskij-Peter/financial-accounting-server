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

router.post("/register", validationUser, asyncWrapper(registerUser));
router.post("/login", validationUser, asyncWrapper(loginUser));
router.post("/logout", authorization, asyncWrapper(logoutUser));

module.exports = router;
