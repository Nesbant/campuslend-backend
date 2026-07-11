'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Loan.belongsTo(models.Post, { foreignKey: 'postId' });
      Loan.belongsTo(models.User, { as: 'lender', foreignKey: 'lenderId' });
      Loan.belongsTo(models.User, { as: 'borrower', foreignKey: 'borrowerId' });
      Loan.hasMany(models.Review, { foreignKey: 'loanId' });
    }
  }
  Loan.init({
    requestDate: DataTypes.DATE,
    approvalDate: DataTypes.DATE,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    returnDate: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM(
        'pending',
        'approved',
        'rejected',
        'active',
        'returned',
        'overdue'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Loan',
  });
  return Loan;
};