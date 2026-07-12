'use strict';

const Sequelize = require('sequelize');
const {
  databaseUrl,
  normalizeDatabaseUrl,
  runtimeOptions,
} = require('../config/database');

const sequelize = new Sequelize(
  normalizeDatabaseUrl(databaseUrl()),
  runtimeOptions(),
);

// --- MODELOS DE backprueba ---

const User = sequelize.define(
  'User',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    passwordHash: { type: Sequelize.TEXT, allowNull: false },
    institution: { type: Sequelize.STRING, allowNull: false },
    studentId: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING },
    major: { type: Sequelize.STRING },
    campus: { type: Sequelize.STRING },
    avatar: { type: Sequelize.TEXT, defaultValue: '' },
  },
  {
    tableName: 'Users',
    indexes: [{ unique: true, fields: ['institution', 'studentId'] }],
  },
);

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: Sequelize.ENUM('lending', 'requesting', 'lent'),
      allowNull: false,
    },
    category: { type: Sequelize.STRING },
    title: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT },
    imageUrl: { type: Sequelize.STRING },
    loanDuration: { type: Sequelize.STRING },
    pickupLocation: { type: Sequelize.STRING },
    views: { type: Sequelize.INTEGER, defaultValue: 0 },
  },
  { tableName: 'Posts' },
);

const Chat = sequelize.define(
  'Chat',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    reference: { type: Sequelize.STRING, allowNull: true },
    postId: { type: Sequelize.UUID, allowNull: true },
    lastMessageAt: { type: Sequelize.DATE },
  },
  { tableName: 'Chats' },
);

const Message = sequelize.define(
  'Message',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    content: { type: Sequelize.TEXT, allowNull: false },
    isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
  },
  { tableName: 'Messages' },
);

const ChatParticipant = sequelize.define(
  'ChatParticipant',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
  },
  { tableName: 'ChatParticipants' },
);

// --- MODELOS ADICIONALES QUE YA TENÍAMOS ---

const Institution = sequelize.define(
  'Institution',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
  },
  { tableName: 'Institutions' },
);

const Campus = sequelize.define(
  'Campus',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
  },
  { tableName: 'Campuses' },
);

const Major = sequelize.define(
  'Major',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
  },
  { tableName: 'Majors' },
);

const Loan = sequelize.define(
  'Loan',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    requestDate: { type: Sequelize.DATE },
    approvalDate: { type: Sequelize.DATE },
    startDate: { type: Sequelize.DATE },
    endDate: { type: Sequelize.DATE },
    returnDate: { type: Sequelize.DATE },
    status: {
      type: Sequelize.ENUM(
        'pending',
        'approved',
        'rejected',
        'active',
        'returned',
        'overdue',
      ),
      defaultValue: 'pending',
    },
    notes: { type: Sequelize.TEXT },
  },
  { tableName: 'Loans' },
);

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: { type: Sequelize.TEXT },
  },
  { tableName: 'Reviews' },
);

const UserFavorite = sequelize.define(
  'UserFavorite',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
  },
  { tableName: 'UserFavorites' },
);

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    type: { type: Sequelize.STRING, allowNull: false },
    message: { type: Sequelize.TEXT, allowNull: false },
    isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
  },
  { tableName: 'Notifications' },
);

// --- DEFINICIÓN DE ASOCIACIONES ---

// User
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
User.belongsToMany(Chat, {
  through: ChatParticipant,
  foreignKey: 'userId',
  as: 'chats',
});
User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' });
User.hasMany(Loan, { as: 'loansGiven', foreignKey: 'lenderId' });
User.hasMany(Loan, { as: 'loansTaken', foreignKey: 'borrowerId' });
User.belongsToMany(Post, {
  through: UserFavorite,
  foreignKey: 'userId',
  as: 'favoritePosts',
});
User.hasMany(Review, { as: 'reviewsWritten', foreignKey: 'reviewerId' });
User.hasMany(Review, { as: 'reviewsReceived', foreignKey: 'revieweeId' });
User.hasMany(Notification, { as: 'notifications', foreignKey: 'userId' });

// Post
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Post.hasMany(Loan, { foreignKey: 'postId' });
Post.hasMany(Chat, { foreignKey: 'postId', as: 'chats' });
Post.belongsToMany(User, {
  through: UserFavorite,
  foreignKey: 'postId',
  as: 'favoritedBy',
});

// Chat
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Chat.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Chat.belongsToMany(User, {
  through: ChatParticipant,
  foreignKey: 'chatId',
  as: 'participants',
});

// Message
Message.belongsTo(Chat, { foreignKey: 'chatId' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

// Loan
Loan.belongsTo(Post, { foreignKey: 'postId' });
Loan.belongsTo(User, { as: 'lender', foreignKey: 'lenderId' });
Loan.belongsTo(User, { as: 'borrower', foreignKey: 'borrowerId' });
Loan.hasMany(Review, { foreignKey: 'loanId' });

// Review
Review.belongsTo(Loan, { foreignKey: 'loanId' });
Review.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewerId' });
Review.belongsTo(User, { as: 'reviewee', foreignKey: 'revieweeId' });

Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Notification.belongsTo(User, { as: 'actor', foreignKey: 'actorId' });
Notification.belongsTo(Post, { as: 'post', foreignKey: 'postId' });
Notification.belongsTo(Loan, { as: 'loan', foreignKey: 'loanId' });

// Institution / Campus / Major
Institution.hasMany(Campus, { foreignKey: 'institutionId', as: 'campuses' });
Campus.belongsTo(Institution, {
  foreignKey: 'institutionId',
  as: 'institution',
});
Campus.hasMany(Major, { foreignKey: 'campusId', as: 'majors' });
Major.belongsTo(Campus, { foreignKey: 'campusId', as: 'campus' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Post,
  Chat,
  Message,
  ChatParticipant,
  Institution,
  Campus,
  Major,
  Loan,
  Review,
  UserFavorite,
  Notification,
};
