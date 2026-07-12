'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatParticipant extends Model {
    static associate(models) {
    }
  }
  ChatParticipant.init(
    {
      
    },
    {
      sequelize,
      modelName: 'ChatParticipant',
    },
  );
  return ChatParticipant;
};
