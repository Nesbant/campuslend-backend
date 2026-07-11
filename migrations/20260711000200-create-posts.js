module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("posts", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			status: {
				type: Sequelize.ENUM("lending", "requesting", "lent"),
				allowNull: false,
				defaultValue: "lending",
			},
			category: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "Otros",
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			imageUrl: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			views: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			isFavorite: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			timeAgo: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "hace un momento",
			},
			authorId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			authorName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			authorAvatar: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			rating: {
				type: Sequelize.FLOAT,
				allowNull: false,
				defaultValue: 5.0,
			},
			completedLoans: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			loanDuration: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "A coordinar",
			},
			pickupLocation: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "A coordinar",
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("posts");
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_posts_status";',
		);
	},
};
