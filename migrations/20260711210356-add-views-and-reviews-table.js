'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Añadir columna de vistas a la tabla Posts
    await queryInterface.addColumn('Posts', 'views', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });

    // 2. Crear la tabla de Reviews
    await queryInterface.createTable('Reviews', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT },
      loanId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Loans', key: 'id' }, onDelete: 'CASCADE' },
      reviewerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      revieweeId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
    await queryInterface.removeColumn('Posts', 'views');
  },
};

