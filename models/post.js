'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author',
      });

      // Relación con Préstamos
      Post.hasMany(models.Loan, { foreignKey: 'postId' });

      // Relación con Favoritos
      Post.belongsToMany(models.User, {
        through: 'UserFavorites',
        foreignKey: 'postId',
        as: 'favoritedBy',
      });
    }
  }
  Post.init({
    status: {
      type: DataTypes.ENUM('lending', 'requesting', 'lent'),
      allowNull: false
    },
    category: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    loanDuration: DataTypes.STRING,
    pickupLocation: DataTypes.STRING,
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};