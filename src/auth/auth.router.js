const { Router } = require("express");

const asyncWrapper = require('../helpers/asyncWrapper');
const {  
  validationUser, 
  loginUser,
  authorization, 
  registerUser
} = require('./auth.controller');

const router = Router();

router.post(`/register`, validationUser, asyncWrapper(registerUser));
router.post('/login',validationUser, asyncWrapper(loginUser));

module.exports = router;
