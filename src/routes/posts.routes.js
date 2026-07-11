const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const {
  validatePost,
  validateId,
} = require('../middlewares/validatePost.middleware');
const { authGuard, authOptional } = require('../middlewares/auth.middleware');

router.get('/', authOptional, postsController.listPosts);
router.get('/me', authGuard, postsController.listMyPosts);
router.get('/:id', authOptional, validateId, postsController.getPost);
router.post('/', authGuard, validatePost, postsController.createPost);
router.post(
  '/:id/favorite',
  authGuard,
  validateId,
  postsController.toggleFavorite,
);
router.put(
  '/:id',
  authGuard,
  validateId,
  validatePost,
  postsController.updatePost,
);
router.delete('/:id', authGuard, validateId, postsController.deletePost);

module.exports = router;
