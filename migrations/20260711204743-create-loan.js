'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      requestDate: {
        type: Sequelize.DATE
      },
      approvalDate: {
        type: Sequelize.DATE
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      returnDate: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM(
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
      notes: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Loans');
  }
};