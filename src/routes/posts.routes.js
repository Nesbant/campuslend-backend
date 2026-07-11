const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const { validatePost, validateId } = require('../middleware/validatePost.middleware');

router.get('/', postsController.listPosts);
router.get('/me', postsController.listMyPosts);
router.get('/:id', validateId, postsController.getPost);
router.post('/', validatePost, postsController.createPost);
router.put('/:id', validateId, validatePost, postsController.updatePost);
router.delete('/:id', validateId, postsController.deletePost);

module.exports = router;
