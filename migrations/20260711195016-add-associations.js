'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'authorId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'authorId');
  },
};
