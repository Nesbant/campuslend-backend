const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validationError(message, details = []) {
  const error = new Error(message);
  error.statusCode = 422;
  error.code = 'VALIDATION_ERROR';
  error.details = details;
  return error;
}

function validateRegister(req, _res, next) {
  const required = ['name', 'email', 'institution', 'studentId', 'phone', 'major', 'campus', 'password'];
  const missing = required.filter((field) => typeof req.body[field] !== 'string' || !req.body[field].trim());
  if (missing.length) return next(validationError('Todos los campos son obligatorios.', missing));
  if (!EMAIL_PATTERN.test(req.body.email.trim())) return next(validationError('Ingresa un correo electrónico válido.', ['email']));
  if (req.body.password.length < 8) return next(validationError('La contraseña debe tener al menos 8 caracteres.', ['password']));
  next();
}

function validateLogin(req, _res, next) {
  if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string' || !req.body.email.trim() || !req.body.password) {
    return next(validationError('Correo y contraseña son obligatorios.', ['email', 'password']));
  }
  if (!EMAIL_PATTERN.test(req.body.email.trim())) return next(validationError('Ingresa un correo electrónico válido.', ['email']));
  next();
}

function validateProfile(req, _res, next) {
  const allowed = ['name', 'phone', 'avatar'];
  const received = Object.keys(req.body);
  if (!received.length || received.some((field) => !allowed.includes(field))) {
    return next(validationError('Solo puedes actualizar nombre, teléfono y avatar.', received));
  }
  if ('name' in req.body && (typeof req.body.name !== 'string' || !req.body.name.trim())) {
    return next(validationError('El nombre no puede estar vacío.', ['name']));
  }
  if (received.some((field) => typeof req.body[field] !== 'string')) {
    return next(validationError('Los campos del perfil deben ser texto.', received));
  }
  next();
}

module.exports = { validateRegister, validateLogin, validateProfile };
