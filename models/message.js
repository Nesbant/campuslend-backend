'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Chat, { foreignKey: 'chatId' });
      Message.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId' });
    }
  }
  Message.init(
    {
      content: DataTypes.TEXT,
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
    },
  );
  return Message;
};
