const { cliConfig } = require('./database');

// Sequelize-CLI usará esta configuración para las migraciones.
// El formato es diferente para desarrollo y producción.
module.exports = {
  development: cliConfig(),
  production: cliConfig(),
  test: cliConfig(),
};
