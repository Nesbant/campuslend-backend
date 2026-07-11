'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // --- TABLAS DE CHAT ---
    await queryInterface.createTable('Chats', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      lastMessageAt: { type: Sequelize.DATE },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('Messages', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      content: { type: Sequelize.TEXT, allowNull: false },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      chatId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Chats', key: 'id' }, onDelete: 'CASCADE' },
      senderId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('ChatParticipants', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      chatId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Chats', key: 'id' }, onDelete: 'CASCADE' },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // --- TABLA DE PRÉSTAMOS ---
    await queryInterface.createTable('Loans', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      postId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Posts', key: 'id' }, onDelete: 'CASCADE' },
      lenderId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      borrowerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      requestDate: { type: Sequelize.DATE },
      approvalDate: { type: Sequelize.DATE },
      startDate: { type: Sequelize.DATE },
      endDate: { type: Sequelize.DATE },
      returnDate: { type: Sequelize.DATE },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected', 'active', 'returned', 'overdue'), defaultValue: 'pending' },
      notes: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // --- TABLA DE FAVORITOS ---
    await queryInterface.createTable('UserFavorites', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      postId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Posts', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserFavorites');
    await queryInterface.dropTable('Loans');
    await queryInterface.dropTable('ChatParticipants');
    await queryInterface.dropTable('Messages');
    await queryInterface.dropTable('Chats');
  },
};

