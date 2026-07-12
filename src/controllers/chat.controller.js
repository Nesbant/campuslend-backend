const {
  Chat,
  User,
  Message,
  ChatParticipant,
  Post,
  sequelize,
} = require('../../models');
const { Op } = require('sequelize');

/**
 * Inicia o encuentra una conversación entre el usuario actual y otro usuario.
 */
async function findOrCreateChat(req, res, next) {
  const { recipientId, reference, postId } = req.body;
  const senderId = req.user.id;

  if (typeof recipientId !== 'string' || !recipientId.trim()) {
    return res.status(400).json({
      success: false,
      message: 'El destinatario es obligatorio.',
    });
  }

  if (senderId === recipientId) {
    return res.status(400).json({
      success: false,
      message: 'No puedes iniciar un chat contigo mismo.',
    });
  }

  try {
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'El usuario destinatario no existe.',
      });
    }
    if (postId) {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'La publicación asociada no existe.',
        });
      }
    }

    // Busca chats compartidos por ambos usuarios y reutiliza solamente el de
    // la misma publicación. Así cada artículo conserva su propio contexto.
    const chatMatches = await ChatParticipant.findAll({
      attributes: ['chatId'],
      where: {
        userId: {
          [Op.in]: [senderId, recipientId],
        },
      },
      group: ['chatId'],
      having: sequelize.literal('COUNT(DISTINCT "userId") = 2'),
      raw: true,
    });

    const sharedChatIds = chatMatches.map((match) => match.chatId);
    const existingChat = sharedChatIds.length
      ? await Chat.findOne({
          where: {
            id: { [Op.in]: sharedChatIds },
            ...(postId ? { postId } : { postId: null, reference: reference || null }),
          },
        })
      : null;

    if (existingChat) {
      // Si el chat ya existe, lo devolvemos.
      if (reference && existingChat.reference !== reference) {
        await existingChat.update({ reference });
      }
      return res.json({
        success: true,
        data: await getChatDetails(existingChat.id),
      });
    }

    // Si no existe, creamos uno nuevo en una transacción.
    const newChat = await sequelize.transaction(async (t) => {
      const createdChat = await Chat.create(
        { reference: reference || null, postId: postId || null },
        { transaction: t },
      );
      await ChatParticipant.bulkCreate(
        [
          { chatId: createdChat.id, userId: senderId },
          { chatId: createdChat.id, userId: recipientId },
        ],
        { transaction: t },
      );
      return createdChat;
    });

    const finalChat = await getChatDetails(newChat.id);
    res.status(201).json({ success: true, data: finalChat });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtiene todas las conversaciones del usuario actual.
 */
async function listMyChats(req, res, next) {
  try {
    const chats = await Chat.findAll({
      include: [
        {
          model: User,
          as: 'participants',
          where: { id: { [Op.ne]: req.user.id } }, // Excluir al usuario actual de los participantes
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title', 'authorId'],
        },
      ],
      order: [['lastMessageAt', 'DESC']],
    });
    res.json({ success: true, data: chats });
  } catch (error) {
    next(error);
  }
}

async function getChatById(req, res, next) {
  try {
    const chat = await Chat.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: Message,
          as: 'messages',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'name'],
            },
          ],
          order: [['createdAt', 'ASC']],
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title', 'authorId'],
        },
      ],
    });

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: 'Chat no encontrado.' });
    }

    if (
      !chat.participants.some((participant) => participant.id === req.user.id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'No tienes acceso a este chat.' });
    }

    res.json({ success: true, data: chat });
  } catch (error) {
    next(error);
  }
}

async function sendMessage(req, res, next) {
  try {
    const content =
      typeof req.body.content === 'string' ? req.body.content.trim() : '';
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede estar vacío.',
      });
    }
    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede superar los 500 caracteres.',
      });
    }
    const chat = await Chat.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id'],
        },
      ],
    });

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: 'Chat no encontrado.' });
    }

    if (
      !chat.participants.some((participant) => participant.id === req.user.id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'No tienes acceso a este chat.' });
    }

    const message = await Message.create({
      chatId: chat.id,
      senderId: req.user.id,
      content,
      isRead: false,
    });

    await chat.update({ lastMessageAt: new Date() });

    const messageWithSender = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
    });

    res.status(201).json({ success: true, data: messageWithSender });
  } catch (error) {
    next(error);
  }
}

// Función auxiliar para obtener los detalles de un chat
async function getChatDetails(chatId) {
  return Chat.findByPk(chatId, {
    include: [
      {
        model: User,
        as: 'participants',
        attributes: ['id', 'name', 'avatar'],
      },
      {
        model: Message,
        as: 'messages',
        limit: 1,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
      },
      {
        model: Post,
        as: 'post',
        attributes: ['id', 'title', 'authorId'],
      },
    ],
  });
}

module.exports = {
  findOrCreateChat,
  listMyChats,
  getChatById,
  sendMessage,
};
