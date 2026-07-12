function createValidationError(message, code, details) {
	const error = new Error(message);
	error.statusCode = 400;
	error.code = code;
	if (details) error.details = details;
	return error;
}

function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}

function validateConversationId(req, _res, next) {
	if (!isNonEmptyString(req.params.conversationId)) {
		return next(
			createValidationError(
				"El identificador de la conversación es obligatorio.",
				"INVALID_CONVERSATION_ID",
			),
		);
	}

	req.params.conversationId = req.params.conversationId.trim();
	return next();
}

function validateCreateConversation(req, _res, next) {
	const { postId, otherUserId } = req.body || {};
	const details = [];

	if (!isNonEmptyString(postId)) {
		details.push({
			field: "postId",
			message: "La publicación es obligatoria.",
		});
	}

	if (!isNonEmptyString(otherUserId)) {
		details.push({
			field: "otherUserId",
			message: "El otro usuario es obligatorio.",
		});
	}

	if (details.length > 0) {
		return next(
			createValidationError(
				"Los datos de la conversación no son válidos.",
				"INVALID_CONVERSATION_PAYLOAD",
				details,
			),
		);
	}

	req.body.postId = postId.trim();
	req.body.otherUserId = otherUserId.trim();
	return next();
}

function validateMessage(req, _res, next) {
	const { text } = req.body || {};

	if (typeof text !== "string") {
		return next(
			createValidationError(
				"El mensaje es obligatorio.",
				"INVALID_MESSAGE_PAYLOAD",
			),
		);
	}

	const trimmedText = text.trim();

	if (!trimmedText) {
		return next(
			createValidationError(
				"El mensaje no puede estar vacío.",
				"EMPTY_MESSAGE",
			),
		);
	}

	if (trimmedText.length > 500) {
		return next(
			createValidationError(
				"El mensaje no puede superar los 500 caracteres.",
				"MESSAGE_TOO_LONG",
			),
		);
	}

	req.body.text = trimmedText;
	return next();
}

module.exports = {
	validateConversationId,
	validateCreateConversation,
	validateMessage,
};
