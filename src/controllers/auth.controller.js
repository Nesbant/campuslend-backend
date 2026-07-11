const { User } = require('../../models');
const passwordService = require('../services/password.service');
const tokenService = require('../services/token.service');

function publicUser(user) {
  // .toJSON() es un método de Sequelize para obtener el objeto plano
  const { passwordHash, ...safeUser } = user.toJSON();
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
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res
        .status(409)
        .json({
          success: false,
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Este correo ya se encuentra registrado.',
        });
    }

    const studentId = req.body.studentId.trim();
    const institution = req.body.institution.trim();
    const existingStudent = await User.findOne({
      where: { studentId, institution },
    });
    if (existingStudent) {
      return res
        .status(409)
        .json({
          success: false,
          code: 'STUDENT_ALREADY_EXISTS',
          message:
            'Este código de estudiante ya está registrado en la institución.',
        });
    }

    const passwordHash = await passwordService.hash(req.body.password);
    const user = await User.create({
      ...req.body,
      email,
      studentId,
      institution,
      passwordHash,
      avatar: '',
    });
    res
      .status(201)
      .json({
        success: true,
        message: 'Usuario registrado correctamente.',
        data: authResponse(user),
      });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (
      !user ||
      !(await passwordService.compare(req.body.password, user.passwordHash))
    ) {
      return res
        .status(401)
        .json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Correo o contraseña incorrectos.',
        });
    }
    res.json({ success: true, data: authResponse(user) });
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user)
      return res
        .status(401)
        .json({
          success: false,
          message: 'El usuario de la sesión ya no existe.',
        });
    res.json({ success: true, data: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user)
      return res
        .status(401)
        .json({
          success: false,
          message: 'El usuario de la sesión ya no existe.',
        });

    // Excluimos campos que no deberían poder cambiarse desde aquí
    const { email, password, passwordHash, ...allowedChanges } = req.body;

    await user.update(allowedChanges);

    // Devolvemos el usuario actualizado con un nuevo token (por si el nombre cambió, etc.)
    res.json({
      success: true,
      message: 'Perfil actualizado correctamente.',
      data: authResponse(user),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getProfile, updateProfile };
