module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("users", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			institution: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			studentId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			major: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			campus: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			avatar: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			passwordHash: {
				type: Sequelize.TEXT,
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

		await queryInterface.addIndex("users", ["institution", "studentId"], {
			unique: true,
			name: "users_institution_student_id_unique",
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("users");
	},
};
