/**
 * Este archivo ahora sirve como un punto de re-exportación
 * para la instancia de Sequelize gestionada por `models/index.js`.
 * Esto asegura que toda la aplicación use una única conexión.
 */
const { sequelize } = require('./models'); // Importamos desde el index de modelos
module.exports = sequelize; // Exportamos la instancia correcta
