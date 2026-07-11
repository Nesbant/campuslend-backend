const { Sequelize } = require("sequelize");
require("dotenv").config({ quiet: true });

const rawDatabaseUrl =
	process.env.DATABASE_URL ||
	"postgres://missing:missing@localhost:5432/missing";

function normalizeDatabaseUrl(value) {
	try {
		const url = new URL(value);
		url.searchParams.delete("sslmode");
		return url.toString();
	} catch {
		return value;
	}
}

const sequelize = new Sequelize(normalizeDatabaseUrl(rawDatabaseUrl), {
	dialect: "postgres",
	logging: process.env.SEQUELIZE_LOGGING === "true" ? console.log : false,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
});

module.exports = sequelize;
