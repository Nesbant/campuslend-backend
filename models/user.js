'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        foreignKey: 'authorId',
        as: 'posts',
      });

      // Relaciones de Chat
      User.belongsToMany(models.Chat, {
        through: 'ChatParticipants',
        foreignKey: 'userId',
        as: 'chats',
      });
      User.hasMany(models.Message, {
        as: 'sentMessages',
        foreignKey: 'senderId',
      });
      
      // Relaciones de Reseñas
      User.hasMany(models.Review, { as: 'reviewsWritten', foreignKey: 'reviewerId' });
      User.hasMany(models.Review, { as: 'reviewsReceived', foreignKey: 'revieweeId' });

      // Relaciones de Préstamos
      User.hasMany(models.Loan, { as: 'loansGiven', foreignKey: 'lenderId' });
      User.hasMany(models.Loan, { as: 'loansTaken', foreignKey: 'borrowerId' });

      // Relaciones de Favoritos
      User.belongsToMany(models.Post, {
        through: 'UserFavorites',
        foreignKey: 'userId',
        as: 'favoritePosts',
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      passwordHash: DataTypes.STRING,
      institution: DataTypes.STRING,
      studentId: DataTypes.STRING,
      phone: DataTypes.STRING,
      major: DataTypes.STRING,
      campus: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
