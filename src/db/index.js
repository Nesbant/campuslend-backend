const { sequelize, Post } = require("./models");

function demoPosts() {
	const now = new Date();

	return [
		{
			status: "lending",
			category: "Tecnología",
			title: "Calculadora Científica Casio",
			description: "Calculadora en perfecto estado para exámenes y tareas.",
			imageUrl:
				"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
			views: 125,
			isFavorite: false,
			timeAgo: "hace 2 horas",
			authorId: "user-001",
			authorName: "Ana Ruiz",
			authorAvatar: "",
			rating: 4.9,
			completedLoans: 14,
			loanDuration: "Durante el ciclo",
			pickupLocation: "Pabellón de Ciencias",
			createdAt: now,
			updatedAt: now,
		},
		{
			status: "requesting",
			category: "Libros",
			title: "Física Universitaria Vol. 2",
			description: "Necesito el libro para preparar mi parcial esta semana.",
			imageUrl:
				"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
			views: 0,
			isFavorite: false,
			timeAgo: "hace 3 horas",
			authorId: "user-002",
			authorName: "Luis Torres",
			authorAvatar: "",
			rating: 4.5,
			completedLoans: 3,
			loanDuration: "2 semanas",
			pickupLocation: "Biblioteca Central",
			createdAt: now,
			updatedAt: now,
		},
		{
			status: "lent",
			category: "Materiales",
			title: "Juego de Escuadras y Regla T",
			description: "Material de dibujo técnico en buen estado.",
			imageUrl:
				"https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
			views: 0,
			isFavorite: false,
			timeAgo: "hace 1 día",
			authorId: "user-003",
			authorName: "Carlos Gómez",
			authorAvatar: "",
			rating: 5.0,
			completedLoans: 28,
			loanDuration: "1 semana",
			pickupLocation: "Patio de Arquitectura",
			createdAt: now,
			updatedAt: now,
		},
	];
}

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
