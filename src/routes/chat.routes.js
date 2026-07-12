const { Router } = require('express');
const { authGuard } = require('../middleware/auth.middleware');
const {
  findOrCreateChat,
  listMyChats,
  getChatById,
  sendMessage,
} = require('../controllers/chat.controller');

const router = Router();

router.get('/', authGuard, listMyChats);
router.post('/', authGuard, findOrCreateChat);
router.get('/:id', authGuard, getChatById);
router.post('/:id/messages', authGuard, sendMessage);

module.exports = router;
