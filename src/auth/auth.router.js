const { Router } = require("express");
const asyncWrapper = require('../helpers/asyncWrapper');
const router = Router();
const {registerUser} = require('./auth.controller')

router.post(`/register`, asyncWrapper(registerUser));
// router.post('/login', asyncWrapper(loginUser));
// router.get();
// router.delete();

module.exports = router;
