require("dotenv").config({ quiet: true });

const FALLBACK_DATABASE_URL =
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

function databaseUrl() {
	return process.env.DATABASE_URL || FALLBACK_DATABASE_URL;
}

function logging() {
	return process.env.SEQUELIZE_LOGGING === "true" ? console.log : false;
}

function dialectOptions() {
	return {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	};
}

function runtimeOptions() {
	return {
		dialect: "postgres",
		logging: logging(),
		dialectOptions: dialectOptions(),
	};
}

function cliEnvironmentConfig() {
	return {
		use_env_variable: "DATABASE_URL",
		dialect: "postgres",
		logging: logging(),
		dialectOptions: dialectOptions(),
	};
}

function cliConfig() {
	return {
		development: cliEnvironmentConfig(),
		test: cliEnvironmentConfig(),
		production: cliEnvironmentConfig(),
	};
}

module.exports = {
	databaseUrl,
	normalizeDatabaseUrl,
	runtimeOptions,
	cliConfig,
};
