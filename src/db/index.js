const { sequelize, Post } = require("../../models");
const { demoPosts } = require("./demo-posts");

async function seedDemoPostsIfEmpty() {
	const count = await Post.count();
	if (count > 0) return;
	await Post.bulkCreate(demoPosts());
}

async function initDatabase() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
	}

	await sequelize.authenticate();
	await sequelize.sync();
	await seedDemoPostsIfEmpty();
}

module.exports = {
	sequelize,
	initDatabase,
	seedDemoPostsIfEmpty,
};
