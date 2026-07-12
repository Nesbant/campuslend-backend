module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("conversations", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			postId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ownerId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			participantId: {
				type: Sequelize.STRING,
				allowNull: false,
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

		await queryInterface.addIndex(
			"conversations",
			["postId", "ownerId", "participantId"],
			{
				unique: true,
				name: "conversations_post_owner_participant_unique",
			},
		);
	},

	async down(queryInterface) {
		await queryInterface.dropTable("conversations");
	},
};
