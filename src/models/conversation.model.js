const { Op, UniqueConstraintError } = require("sequelize");
const { sequelize, Conversation, Message } = require("../db/models");
const postModel = require("./post.model");
const userModel = require("./user.model");

function createError(message, statusCode, code) {
	const error = new Error(message);
	error.statusCode = statusCode;
	if (code) error.code = code;
	return error;
}

function toDateString(value) {
	return value?.toISOString?.() || value;
}

function toConversationDto(conversation) {
	if (!conversation) return null;
	const value = conversation.get
		? conversation.get({ plain: true })
		: conversation;

	return {
		...value,
		createdAt: toDateString(value.createdAt),
		updatedAt: toDateString(value.updatedAt),
	};
}

function toMessageDto(message) {
	if (!message) return null;
	const value = message.get ? message.get({ plain: true }) : message;

	return {
		id: value.id,
		conversationId: value.conversationId,
		senderId: value.senderId,
		text: value.text,
		createdAt: toDateString(value.createdAt),
	};
}

function isParticipant(conversation, userId) {
	return (
		conversation.ownerId === userId || conversation.participantId === userId
	);
}

function resolveParticipants(post, currentUserId, otherUserId) {
	if (currentUserId === otherUserId) {
		throw createError(
			"No puedes crear una conversación contigo mismo.",
			400,
			"SELF_CONVERSATION",
		);
	}

	if (currentUserId === post.authorId) {
		return {
			ownerId: currentUserId,
			participantId: otherUserId,
		};
	}

	if (otherUserId !== post.authorId) {
		throw createError(
			"Solo puedes crear conversaciones con el dueño de la publicación.",
			400,
			"INVALID_CONVERSATION_PARTICIPANTS",
		);
	}

	return {
		ownerId: post.authorId,
		participantId: currentUserId,
	};
}

async function requireKnownParticipant(userId) {
	const user = await userModel.findById(userId);
	if (!user) {
		throw createError("El usuario indicado no existe.", 404, "USER_NOT_FOUND");
	}

	return user;
}

async function formatUser(userId, post) {
	const user = await userModel.findById(userId);
	if (user) {
		return {
			id: user.id,
			name: user.name,
			avatar: user.avatar || "",
		};
	}

	if (post && userId === post.authorId) {
		return {
			id: post.authorId,
			name: post.authorName || "Usuario",
			avatar: post.authorAvatar || "",
		};
	}

	return {
		id: userId,
		name: "Usuario",
		avatar: "",
	};
}

async function getLastMessage(conversationId) {
	return Message.findOne({
		where: { conversationId },
		order: [
			["createdAt", "DESC"],
			["id", "DESC"],
		],
	});
}

async function formatConversation(conversationInput, currentUserId) {
	const conversation = toConversationDto(conversationInput);
	const post = await postModel.getPostById(conversation.postId);
	const otherUserId =
		conversation.ownerId === currentUserId
			? conversation.participantId
			: conversation.ownerId;
	const lastMessage = await getLastMessage(conversation.id);
	const lastMessageDto = toMessageDto(lastMessage);

	return {
		id: conversation.id,
		postId: conversation.postId,
		postTitle: post?.title || "Publicación no disponible",
		otherUser: await formatUser(otherUserId, post),
		lastMessage: lastMessageDto?.text || null,
		lastMessageAt: lastMessageDto?.createdAt || null,
		unread: 0,
		isMyPost: conversation.ownerId === currentUserId,
		createdAt: conversation.createdAt,
		updatedAt: conversation.updatedAt,
	};
}

async function listConversations(currentUserId) {
	const conversations = await Conversation.findAll({
		where: {
			[Op.or]: [{ ownerId: currentUserId }, { participantId: currentUserId }],
		},
		order: [["updatedAt", "DESC"]],
	});

	const formatted = await Promise.all(
		conversations.map((conversation) =>
			formatConversation(conversation, currentUserId),
		),
	);

	return formatted.sort(
		(a, b) =>
			new Date(b.lastMessageAt || b.updatedAt || b.createdAt) -
			new Date(a.lastMessageAt || a.updatedAt || a.createdAt),
	);
}

async function findConversationByUniqueFields(
	{ postId, ownerId, participantId },
	options = {},
) {
	return Conversation.findOne({
		where: {
			postId,
			ownerId,
			participantId,
		},
		...options,
	});
}

async function createOrGetConversation(currentUserId, { postId, otherUserId }) {
	const post = await postModel.getPostById(postId);
	if (!post) {
		throw createError("Publicación no encontrada.", 404, "POST_NOT_FOUND");
	}

	const { ownerId, participantId } = resolveParticipants(
		post,
		currentUserId,
		otherUserId,
	);

	if (currentUserId === ownerId) {
		await requireKnownParticipant(participantId);
	}

	const uniqueFields = { postId, ownerId, participantId };

	try {
		const result = await sequelize.transaction(async (transaction) => {
			const existingConversation = await findConversationByUniqueFields(
				uniqueFields,
				{
					transaction,
				},
			);

			if (existingConversation) {
				return { created: false, conversation: existingConversation };
			}

			const conversation = await Conversation.create(uniqueFields, {
				transaction,
			});
			return { created: true, conversation };
		});

		return {
			created: result.created,
			data: await formatConversation(result.conversation, currentUserId),
		};
	} catch (error) {
		if (!(error instanceof UniqueConstraintError)) throw error;

		const existingConversation =
			await findConversationByUniqueFields(uniqueFields);
		return {
			created: false,
			data: await formatConversation(existingConversation, currentUserId),
		};
	}
}

async function getConversationForUser(
	conversationId,
	currentUserId,
	transaction,
) {
	const conversation = await Conversation.findByPk(conversationId, {
		transaction,
	});

	if (!conversation) {
		throw createError(
			"Conversación no encontrada.",
			404,
			"CONVERSATION_NOT_FOUND",
		);
	}

	const conversationDto = toConversationDto(conversation);

	if (!isParticipant(conversationDto, currentUserId)) {
		throw createError(
			"No tienes permisos para acceder a esta conversación.",
			403,
			"CONVERSATION_FORBIDDEN",
		);
	}

	return conversation;
}

async function listMessages(currentUserId, conversationId) {
	await getConversationForUser(conversationId, currentUserId);
	const messages = await Message.findAll({
		where: { conversationId },
		order: [
			["createdAt", "ASC"],
			["id", "ASC"],
		],
	});

	return messages.map(toMessageDto);
}

async function sendMessage(currentUserId, conversationId, text) {
	const trimmedText = typeof text === "string" ? text.trim() : "";

	if (!trimmedText) {
		throw createError("El mensaje no puede estar vacío.", 400, "EMPTY_MESSAGE");
	}

	if (trimmedText.length > 500) {
		throw createError(
			"El mensaje no puede superar los 500 caracteres.",
			400,
			"MESSAGE_TOO_LONG",
		);
	}

	const message = await sequelize.transaction(async (transaction) => {
		const conversation = await getConversationForUser(
			conversationId,
			currentUserId,
			transaction,
		);
		const createdMessage = await Message.create(
			{
				conversationId,
				senderId: currentUserId,
				text: trimmedText,
			},
			{ transaction },
		);

		await conversation.update({ updatedAt: new Date() }, { transaction });
		return createdMessage;
	});

	return toMessageDto(message);
}

module.exports = {
	listConversations,
	createOrGetConversation,
	listMessages,
	sendMessage,
};
