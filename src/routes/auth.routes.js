const express = require('express');
const controller = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');
const { validateRegister, validateLogin, validateProfile } = require('../middleware/validateAuth.middleware');

const router = express.Router();
router.post('/register', validateRegister, controller.register);
router.post('/login', validateLogin, controller.login);
router.get('/me', authenticate, controller.getProfile);
router.patch('/me', authenticate, validateProfile, controller.updateProfile);

module.exports = router;
