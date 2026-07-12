const conversationModel = require("../models/conversation.model");

async function listConversations(req, res, next) {
	try {
		const conversations = await conversationModel.listConversations(
			req.user.id,
		);

		res.json({
			success: true,
			count: conversations.length,
			data: conversations,
		});
	} catch (error) {
		next(error);
	}
}

async function createConversation(req, res, next) {
	try {
		const result = await conversationModel.createOrGetConversation(
			req.user.id,
			req.body,
		);

		res.status(result.created ? 201 : 200).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		next(error);
	}
}

async function listMessages(req, res, next) {
	try {
		const messages = await conversationModel.listMessages(
			req.user.id,
			req.params.conversationId,
		);

		res.json({
			success: true,
			count: messages.length,
			data: messages,
		});
	} catch (error) {
		next(error);
	}
}

async function sendMessage(req, res, next) {
	try {
		const message = await conversationModel.sendMessage(
			req.user.id,
			req.params.conversationId,
			req.body.text,
		);

		res.status(201).json({
			success: true,
			data: message,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	listConversations,
	createConversation,
	listMessages,
	sendMessage,
};
