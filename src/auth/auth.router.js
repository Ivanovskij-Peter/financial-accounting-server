const { Router } = require("express");

const asyncWrapper = require('../helpers/asyncWrapper');
const {  validationUser, loginUser, authorization} = require('./auth.controller');


const router = Router();

// router.post();
router.post('/login',validationUser, asyncWrapper(loginUser));
// router.get();
// router.delete();
module.exports = router;
