const express = require('express');
const { authGuard } = require('../middleware/auth.middleware');
const controller = require('../controllers/notifications.controller');

const router = express.Router();
router.get('/', authGuard, controller.listNotifications);
router.patch('/read-all', authGuard, controller.markAllRead);
router.patch('/:id/respond', authGuard, controller.respondToLoanRequest);

module.exports = router;
