function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'] || 'guest-user';
  const userName = req.headers['x-user-name'] || 'Usuario Anónimo';
  const userAvatar = req.headers['x-user-avatar'] || '';

  req.user = {
    id: userId,
    name: userName,
    avatar: userAvatar,
  };

  next();
}

module.exports = authMiddleware;
