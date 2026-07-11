const { Post, User, UserFavorite, Sequelize } = require('../../models');
const { Op } = Sequelize;

async function listPosts(req, res, next) {
  try {
    const { text, category, type } = req.query;
    const where = {};

    if (text) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${text}%` } },
        { description: { [Op.iLike]: `%${text}%` } },
      ];
    }
    if (category) where.category = category;
    if (type) where.status = type === 'request' ? 'requesting' : 'lending';

    // Incluir dinámicamente los datos del autor y si es favorito para el usuario actual
    const include = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
    ];

    // Si hay un usuario logueado, verificamos qué posts son sus favoritos
    if (req.user) {
      include.push({
        model: User,
        as: 'favoritedBy',
        where: { id: req.user.id },
        required: false,
      });
    }

    const posts = await Post.findAll({
      where,
      include,
      order: [['createdAt', 'DESC']],
    });

    await post.increment('views');

    res.json({
      success: true,
      data: posts.map((post) => {
        const isFavorite = post.favoritedBy && post.favoritedBy.length > 0;
        // Eliminamos la propiedad para no exponerla en el API
        delete post.dataValues.favoritedBy;
        return { ...post.dataValues, isFavorite };
      }),
    });
  } catch (error) {
    next(error);
  }
}

async function getPost(req, res, next) {
  try {
    const include = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
    ];

    if (req.user) {
      include.push({
        model: User,
        as: 'favoritedBy',
        where: { id: req.user.id },
        required: false,
      });
    }

    const post = await Post.findByPk(req.params.id, {
      include,
    });

    await post.increment('views');

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Publicación no encontrada.' });
    }

    const isFavorite = post.favoritedBy && post.favoritedBy.length > 0;
    delete post.dataValues.favoritedBy;
    const postWithFavorite = { ...post.dataValues, isFavorite };

    res.json({ success: true, data: postWithFavorite });
  } catch (error) {
    next(error);
  }
}

async function listMyPosts(req, res, next) {
  try {
    const posts = await Post.findAll({
      where: { authorId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

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
    const { type, ...postData } = req.body;
    const newPost = await Post.create({
      ...postData,
      status: type === 'request' ? 'requesting' : 'lending',
      authorId: req.user.id,
    });

    // Para devolver el post con los datos del autor
    const postWithAuthor = await Post.findByPk(newPost.id, {
      include: {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
    });

    res.status(201).json({ success: true, data: postWithAuthor });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Publicación no encontrada.' });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar esta publicación.',
      });
    }

    const { type, ...changes } = req.body;
    const status =
      type === 'request'
        ? 'requesting'
        : type === 'lend'
          ? 'lending'
          : post.status;

    await post.update({ ...changes, status });

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Publicación no encontrada.' });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta publicación.',
      });
    }

    await post.destroy();
    res.json({
      success: true,
      message: 'Publicación eliminada correctamente.',
    });
  } catch (error) {
    next(error);
  }
}

async function toggleFavorite(req, res, next) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const favorite = await UserFavorite.findOne({ where: { userId, postId } });

    if (favorite) {
      // Si ya existe, lo eliminamos
      await favorite.destroy();
      res.json({
        success: true,
        message: 'Publicación eliminada de favoritos.',
        data: { isFavorite: false },
      });
    } else {
      // Si no existe, lo creamos
      await UserFavorite.create({ userId, postId });
      res.status(201).json({
        success: true,
        message: 'Publicación añadida a favoritos.',
        data: { isFavorite: true },
      });
    }
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
  toggleFavorite,
};
