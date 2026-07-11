const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const { validatePost, validateId } = require('../middleware/validatePost.middleware');
const authenticate = require('../middleware/auth.middleware');

router.get('/', postsController.listPosts);
router.get('/me', authenticate, postsController.listMyPosts);
router.get('/:id', validateId, postsController.getPost);
router.post('/', authenticate, validatePost, postsController.createPost);
router.put('/:id', authenticate, validateId, validatePost, postsController.updatePost);
router.delete('/:id', authenticate, validateId, postsController.deletePost);

module.exports = router;
