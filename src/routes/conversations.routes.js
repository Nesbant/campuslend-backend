const express = require("express");
const router = express.Router();
const conversationsController = require("../controllers/conversations.controller");
const authenticate = require("../middleware/auth.middleware");
const {
	validateConversationId,
	validateCreateConversation,
	validateMessage,
} = require("../middleware/validateConversation.middleware");

router.use(authenticate);

router.get("/", conversationsController.listConversations);
router.post(
	"/",
	validateCreateConversation,
	conversationsController.createConversation,
);
router.get(
	"/:conversationId/messages",
	validateConversationId,
	conversationsController.listMessages,
);
router.post(
	"/:conversationId/messages",
	validateConversationId,
	validateMessage,
	conversationsController.sendMessage,
);

module.exports = router;
