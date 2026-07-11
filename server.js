require("dotenv").config({ quiet: true });
const app = require("./src/app");
const { initDatabase } = require("./src/db");

const PORT = process.env.PORT || 4000;

async function startServer() {
	try {
		await initDatabase();
		app.listen(PORT, () => {
			console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("No se pudo inicializar la base de datos.", error.message);
		process.exit(1);
	}
}

startServer();
