require('dotenv').config();

function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  return url;
}

function normalizeDatabaseUrl(url) {
  return url.split('?')[0];
}

function runtimeOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  const logging = process.env.SEQUELIZE_LOGGING === 'true';

  const options = {
    logging: logging ? console.log : false,
    dialect: 'postgres',
  };

   options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };

  return options;
}

const cliConfig = () => ({
  url: normalizeDatabaseUrl(databaseUrl()),
  ...runtimeOptions(),
});

module.exports = {
  databaseUrl,
  normalizeDatabaseUrl,
  runtimeOptions,
  cliConfig,
};
