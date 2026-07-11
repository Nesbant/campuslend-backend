function validatePost(req, res, next) {
  const { title, category, description, type } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'El título es obligatorio.' });
  }

  if (!category || !category.trim()) {
    return res.status(400).json({ success: false, message: 'La categoría es obligatoria.' });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, message: 'La descripción es obligatoria.' });
  }

  if (type && !['lend', 'request'].includes(type)) {
    return res.status(400).json({ success: false, message: 'El tipo debe ser lend o request.' });
  }

  next();
}

function validateId(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'El id de la publicación es obligatorio.' });
  }

  next();
}

module.exports = { validatePost, validateId };
