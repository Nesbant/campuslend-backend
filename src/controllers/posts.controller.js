const postModel = require('../models/post.model');

async function listPosts(req, res, next) {
  try {
    const { text, category, type } = req.query;
    const posts = await postModel.listPosts({ text, category, type });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await postModel.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

async function listMyPosts(req, res, next) {
  try {
    const posts = await postModel.getUserPosts(req.user.id);

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const newPost = await postModel.createPost({
      ...req.body,
      author: req.user,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const updatedPost = await postModel.updatePost(req.params.id, req.body, req.user);

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    res.json({ success: true, data: updatedPost });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const confirmed = req.body?.confirmDelete === true || req.query?.confirmDelete === 'true';

    if (!confirmed) {
      return res.status(400).json({
        success: false,
        message: 'La confirmación de eliminación es obligatoria.',
      });
    }

    const deleted = await postModel.deletePost(req.params.id, req.user);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    res.json({ success: true, message: 'Publicación eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPosts,
  getPost,
  listMyPosts,
  createPost,
  updatePost,
  deletePost,
};
