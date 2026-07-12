const tokenService = require('../services/token.service');
const { User } = require('../../models');

const getAuthToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.substring(7);
  }
  return null;
};

const authGuard = async (req, res, next) => {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado.' });
  }

  try {
    const decoded = tokenService.verifyAccessToken(token);
    const user = await User.findByPk(decoded.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
  }
};

const authOptional = async (req, res, next) => {
  const token = getAuthToken(req);
  if (token) {
    return authGuard(req, res, next); // Si hay token, lo validamos
  }
  next(); // Si no hay token, simplemente continuamos
};

module.exports = { authGuard, authOptional };
