'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Tabla de Usuarios
      await queryInterface.createTable('Users', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        passwordHash: { type: Sequelize.TEXT, allowNull: false },
        institution: { type: Sequelize.STRING, allowNull: false },
        studentId: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING },
        major: { type: Sequelize.STRING },
        campus: { type: Sequelize.STRING },
        avatar: { type: Sequelize.TEXT, defaultValue: '' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });
      await queryInterface.addIndex('Users', ['institution', 'studentId'], { unique: true, transaction });

      // Tabla de Publicaciones
      await queryInterface.createTable('Posts', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        status: { type: Sequelize.ENUM('lending', 'requesting', 'lent'), allowNull: false },
        category: { type: Sequelize.STRING },
        title: { type: Sequelize.STRING, allowNull: false },
        description: { type: Sequelize.TEXT },
        imageUrl: { type: Sequelize.STRING },
        loanDuration: { type: Sequelize.STRING },
        pickupLocation: { type: Sequelize.STRING },
        views: { type: Sequelize.INTEGER, defaultValue: 0 },
        authorId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      // Tablas de Instituciones
      await queryInterface.createTable('Institutions', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false, unique: true },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      await queryInterface.createTable('Campuses', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        institutionId: { type: Sequelize.UUID, references: { model: 'Institutions', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      await queryInterface.createTable('Majors', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        campusId: { type: Sequelize.UUID, references: { model: 'Campuses', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      // Tablas de Chat
      await queryInterface.createTable('Chats', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        lastMessageAt: { type: Sequelize.DATE },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      await queryInterface.createTable('Messages', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        content: { type: Sequelize.TEXT, allowNull: false },
        isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
        chatId: { type: Sequelize.UUID, references: { model: 'Chats', key: 'id' }, onDelete: 'CASCADE' },
        senderId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      await queryInterface.createTable('ChatParticipants', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        chatId: { type: Sequelize.UUID, references: { model: 'Chats', key: 'id' }, onDelete: 'CASCADE' },
        userId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      // Tabla de Préstamos
      await queryInterface.createTable('Loans', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        requestDate: { type: Sequelize.DATE },
        approvalDate: { type: Sequelize.DATE },
        startDate: { type: Sequelize.DATE },
        endDate: { type: Sequelize.DATE },
        returnDate: { type: Sequelize.DATE },
        status: { type: Sequelize.ENUM('pending', 'approved', 'rejected', 'active', 'returned', 'overdue'), defaultValue: 'pending' },
        notes: { type: Sequelize.TEXT },
        postId: { type: Sequelize.UUID, references: { model: 'Posts', key: 'id' }, onDelete: 'CASCADE' },
        lenderId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        borrowerId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      // Tabla de Reseñas
      await queryInterface.createTable('Reviews', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        rating: { type: Sequelize.INTEGER, allowNull: false },
        comment: { type: Sequelize.TEXT },
        loanId: { type: Sequelize.UUID, references: { model: 'Loans', key: 'id' }, onDelete: 'CASCADE' },
        reviewerId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        revieweeId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      // Tabla de Favoritos
      await queryInterface.createTable('UserFavorites', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        userId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        postId: { type: Sequelize.UUID, references: { model: 'Posts', key: 'id' }, onDelete: 'CASCADE' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('UserFavorites', { transaction });
      await queryInterface.dropTable('Reviews', { transaction });
      await queryInterface.dropTable('Loans', { transaction });
      await queryInterface.dropTable('ChatParticipants', { transaction });
      await queryInterface.dropTable('Messages', { transaction });
      await queryInterface.dropTable('Chats', { transaction });
      await queryInterface.dropTable('Majors', { transaction });
      await queryInterface.dropTable('Campuses', { transaction });
      await queryInterface.dropTable('Institutions', { transaction });
      await queryInterface.dropTable('Posts', { transaction });
      await queryInterface.dropTable('Users', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
}