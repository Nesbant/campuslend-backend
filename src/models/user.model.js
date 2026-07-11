const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const dataFilePath = path.join(__dirname, '..', 'data', 'users.json');

async function readUsers() {
  try {
    return JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, '[]');
    return [];
  }
}

async function writeUsers(users) {
  const temporaryPath = `${dataFilePath}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(users, null, 2));
  await fs.rename(temporaryPath, dataFilePath);
}

async function findByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return (await readUsers()).find((user) => user.email === normalized) || null;
}

async function findById(id) {
  return (await readUsers()).find((user) => user.id === id) || null;
}

async function create(payload) {
  const users = await readUsers();
  const now = new Date().toISOString();
  const user = { id: randomUUID(), ...payload, createdAt: now, updatedAt: now };
  users.push(user);
  await writeUsers(users);
  return user;
}

async function update(id, changes) {
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...changes, updatedAt: new Date().toISOString() };
  await writeUsers(users);
  return users[index];
}

module.exports = { readUsers, findByEmail, findById, create, update };
