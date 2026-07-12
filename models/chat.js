'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.hasMany(models.Message, { foreignKey: 'chatId', as: 'messages' });
      Chat.belongsToMany(models.User, {
        through: 'ChatParticipants',
        foreignKey: 'chatId',
        as: 'participants',
      });
      Chat.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
    }
  }
  Chat.init(
    {
      lastMessageAt: DataTypes.DATE,
      reference: DataTypes.STRING,
      postId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'Chat',
    },
  );
  return Chat;
};
