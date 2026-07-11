const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const dataFilePath = path.join(__dirname, '..', 'data', 'posts.json');

function ensureDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    const dir = path.dirname(dataFilePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(seedPosts(), null, 2));
  }
}

function seedPosts() {
  return [
    {
      id: randomUUID(),
      status: 'lending',
      category: 'Tecnología',
      title: 'Calculadora Científica Casio',
      description: 'Calculadora en perfecto estado para exámenes y tareas.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      views: 125,
      isFavorite: false,
      timeAgo: 'hace 2 horas',
      authorId: 'user-001',
      authorName: 'Ana Ruiz',
      authorAvatar: '',
      rating: 4.9,
      completedLoans: 14,
      loanDuration: 'Durante el ciclo',
      pickupLocation: 'Pabellón de Ciencias',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      status: 'requesting',
      category: 'Libros',
      title: 'Física Universitaria Vol. 2',
      description: 'Necesito el libro para preparar mi parcial esta semana.',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      views: 0,
      isFavorite: false,
      timeAgo: 'hace 3 horas',
      authorId: 'user-002',
      authorName: 'Luis Torres',
      authorAvatar: '',
      rating: 4.5,
      completedLoans: 3,
      loanDuration: '2 semanas',
      pickupLocation: 'Biblioteca Central',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      status: 'lent',
      category: 'Materiales',
      title: 'Juego de Escuadras y Regla T',
      description: 'Material de dibujo técnico en buen estado.',
      imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80',
      views: 0,
      isFavorite: false,
      timeAgo: 'hace 1 día',
      authorId: 'user-003',
      authorName: 'Carlos Gómez',
      authorAvatar: '',
      rating: 5.0,
      completedLoans: 28,
      loanDuration: '1 semana',
      pickupLocation: 'Patio de Arquitectura',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

function readPosts() {
  ensureDataFile();
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
}

function writePosts(posts) {
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
}

function filterPosts(posts, { text, category, type }) {
  return posts.filter((post) => {
    const matchesText = !text
      ? true
      : `${post.title} ${post.description}`.toLowerCase().includes(text.toLowerCase());

    const matchesCategory = !category || post.category === category;

    const normalizedType = type === 'request' ? 'requesting' : type === 'lend' ? 'lending' : type;
    const matchesType = !normalizedType || post.status === normalizedType;

    return matchesText && matchesCategory && matchesType;
  });
}

async function listPosts(filters = {}) {
  const posts = readPosts();
  return filterPosts(posts, filters).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getPostById(id) {
  const posts = readPosts();
  return posts.find((post) => post.id === id);
}

async function getUserPosts(userId) {
  const posts = readPosts();
  return posts.filter((post) => post.authorId === userId);
}

async function createPost(payload) {
  const posts = readPosts();
  const newPost = {
    id: randomUUID(),
    status: payload.type === 'request' ? 'requesting' : 'lending',
    category: payload.category || 'Otros',
    title: payload.title || 'Sin título',
    description: payload.description || 'Sin descripción',
    imageUrl: payload.imageUrl || '',
    loanDuration: payload.loanDuration || 'A coordinar',
    pickupLocation: payload.pickupLocation || 'A coordinar',
    views: 0,
    isFavorite: false,
    timeAgo: 'hace un momento',
    authorId: payload.author?.id || 'guest-user',
    authorName: payload.author?.name || 'Usuario Anónimo',
    authorAvatar: payload.author?.avatar || '',
    rating: 5.0,
    completedLoans: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  posts.unshift(newPost);
  writePosts(posts);
  return newPost;
}

async function updatePost(id, changes, user) {
  const posts = readPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return null;
  }

  if (posts[index].authorId !== user.id) {
    const error = new Error('No tienes permisos para editar esta publicación.');
    error.statusCode = 403;
    throw error;
  }

  const updatedPost = {
    ...posts[index],
    ...changes,
    status: changes.type === 'request' ? 'requesting' : changes.type === 'lend' ? 'lending' : posts[index].status,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updatedPost;
  writePosts(posts);
  return updatedPost;
}

async function deletePost(id, user) {
  const posts = readPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return null;
  }

  if (posts[index].authorId !== user.id) {
    const error = new Error('No tienes permisos para eliminar esta publicación.');
    error.statusCode = 403;
    throw error;
  }

  posts.splice(index, 1);
  writePosts(posts);
  return true;
}

module.exports = {
  listPosts,
  getPostById,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
};
