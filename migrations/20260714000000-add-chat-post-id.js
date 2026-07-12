'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Chats', 'postId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'Posts', key: 'id' },
      onDelete: 'SET NULL',
    });
    await queryInterface.addIndex('Chats', ['postId']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Chats', 'postId');
  },
};
