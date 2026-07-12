'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Loan, { foreignKey: 'loanId' });
      Review.belongsTo(models.User, { as: 'reviewer', foreignKey: 'reviewerId' });
      Review.belongsTo(models.User, { as: 'reviewee', foreignKey: 'revieweeId' });
    }
  }
  Review.init(
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: {
        type: DataTypes.TEXT,
      },
      
    },
    {
      sequelize,
      modelName: 'Review',
    },
  );
  return Review;
};
