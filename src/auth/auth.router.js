const { Router } = require('express');
const asyncWrapper = require('../helpers/asyncWrapper');
const AuthController = require('../auth/auth.controller');
const router = Router();

router.post();
router.post();
router.post(
  '/logout',
  AuthController.authorization,
  asyncWrapper(AuthController.logoutUser),
);
router.get();
router.delete();

module.exports = router;
