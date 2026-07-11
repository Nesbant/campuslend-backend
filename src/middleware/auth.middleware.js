const tokenService = require('../services/token.service');

function authenticate(req, _res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      const error = new Error('Debes iniciar sesión para realizar esta acción.');
      error.statusCode = 401;
      error.code = 'AUTH_REQUIRED';
      throw error;
    }

    const payload = tokenService.verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.avatar || '',
    };
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      error.message = 'La sesión no es válida o ha expirado.';
    }
    next(error);
  }
}

module.exports = authenticate;
