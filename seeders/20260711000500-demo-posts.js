const { QueryTypes } = require("sequelize");
const { demoPosts } = require("../src/db/demo-posts");

module.exports = {
	async up(queryInterface) {
		const existingPosts = await queryInterface.sequelize.query(
			'SELECT COUNT(*)::int AS count FROM "posts";',
			{ type: QueryTypes.SELECT },
		);

		if (existingPosts[0]?.count > 0) return;

		await queryInterface.bulkInsert("posts", demoPosts(new Date()));
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("posts", {
			authorId: ["user-001", "user-002", "user-003"],
		});
	},
};
