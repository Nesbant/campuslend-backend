const express = require('express');
const cors = require('cors');
const postsRoutes = require('./routes/posts.routes');
const authMiddleware = require('./middleware/auth.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    console.log(`[BACKEND] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });

  next();
});
app.use(authMiddleware);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente.' });
});

app.use('/api/posts', postsRoutes);

app.use(errorHandler);

module.exports = app;
