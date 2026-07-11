const userModel = require('../models/user.model');
const passwordService = require('../services/password.service');
const tokenService = require('../services/token.service');

function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function authResponse(user) {
  return {
    user: publicUser(user),
    accessToken: tokenService.signAccessToken(user),
    tokenType: 'Bearer',
    expiresIn: tokenService.ACCESS_TOKEN_TTL_SECONDS,
  };
}

async function register(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const users = await userModel.readUsers();
    if (users.some((user) => user.email === email)) {
      return res.status(409).json({ success: false, code: 'EMAIL_ALREADY_EXISTS', message: 'Este correo ya se encuentra registrado.' });
    }
    const studentId = req.body.studentId.trim();
    if (users.some((user) => user.studentId === studentId && user.institution === req.body.institution.trim())) {
      return res.status(409).json({ success: false, code: 'STUDENT_ALREADY_EXISTS', message: 'Este código de estudiante ya está registrado en la institución.' });
    }

    const user = await userModel.create({
      name: req.body.name.trim(), email, institution: req.body.institution.trim(), studentId,
      phone: req.body.phone.trim(), major: req.body.major.trim(), campus: req.body.campus.trim(),
      avatar: '', passwordHash: await passwordService.hash(req.body.password),
    });
    res.status(201).json({ success: true, message: 'Usuario registrado correctamente.', data: authResponse(user) });
  } catch (error) { next(error); }
}

async function login(req, res, next) {
  try {
    const user = await userModel.findByEmail(req.body.email);
    if (!user || !(await passwordService.compare(req.body.password, user.passwordHash))) {
      return res.status(401).json({ success: false, code: 'INVALID_CREDENTIALS', message: 'Correo o contraseña incorrectos.' });
    }
    res.json({ success: true, data: authResponse(user) });
  } catch (error) { next(error); }
}

async function getProfile(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(401).json({ success: false, message: 'El usuario de la sesión ya no existe.' });
    res.json({ success: true, data: publicUser(user) });
  } catch (error) { next(error); }
}

async function updateProfile(req, res, next) {
  try {
    const changes = Object.fromEntries(Object.entries(req.body).map(([key, value]) => [key, value.trim()]));
    const user = await userModel.update(req.user.id, changes);
    if (!user) return res.status(401).json({ success: false, message: 'El usuario de la sesión ya no existe.' });
    res.json({ success: true, message: 'Perfil actualizado correctamente.', data: authResponse(user) });
  } catch (error) { next(error); }
}

module.exports = { register, login, getProfile, updateProfile };
