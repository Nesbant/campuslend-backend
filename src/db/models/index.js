const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		institution: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		studentId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		major: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		campus: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		avatar: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: "",
		},
		passwordHash: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "users",
		indexes: [
			{
				unique: true,
				fields: ["institution", "studentId"],
			},
		],
	},
);

const Post = sequelize.define(
	"Post",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		status: {
			type: DataTypes.ENUM("lending", "requesting", "lent"),
			allowNull: false,
			defaultValue: "lending",
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "Otros",
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		imageUrl: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: "",
		},
		views: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		isFavorite: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		timeAgo: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "hace un momento",
		},
		authorId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		authorName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		authorAvatar: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: "",
		},
		rating: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 5.0,
		},
		completedLoans: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		loanDuration: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "A coordinar",
		},
		pickupLocation: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "A coordinar",
		},
	},
	{
		tableName: "posts",
	},
);

const Conversation = sequelize.define(
	"Conversation",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		postId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ownerId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		participantId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "conversations",
		indexes: [
			{
				unique: true,
				fields: ["postId", "ownerId", "participantId"],
			},
		],
	},
);

const Message = sequelize.define(
	"Message",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		conversationId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		senderId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		text: {
			type: DataTypes.STRING(500),
			allowNull: false,
		},
	},
	{
		tableName: "messages",
	},
);

module.exports = {
	sequelize,
	User,
	Post,
	Conversation,
	Message,
};
