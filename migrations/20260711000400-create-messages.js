module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("messages", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			conversationId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			senderId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			text: {
				type: Sequelize.STRING(500),
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

		await queryInterface.addIndex("messages", ["conversationId"], {
			name: "messages_conversation_id_index",
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("messages");
	},
};
