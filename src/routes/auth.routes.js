const express = require('express');
const controller = require('../controllers/auth.controller');
const { authGuard } = require('../middleware/auth.middleware');
const {
  validateRegister,
  validateLogin,
  validateProfile,
} = require('../middleware/validateAuth.middleware');

const router = express.Router();
router.post('/register', validateRegister, controller.register);
router.post('/login', validateLogin, controller.login);
router.get('/me', authGuard, controller.getProfile);
router.patch('/me', authGuard, validateProfile, controller.updateProfile);

module.exports = router;
