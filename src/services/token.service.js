const crypto = require('crypto');

const ISSUER = 'campuslend-api';
const AUDIENCE = 'campuslend-web';
const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.JWT_EXPIRES_IN_SECONDS) || 60 * 60;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET es obligatorio en producción.');
  }
  return 'campuslend-development-secret-change-before-production';
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function decode(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}

function signatureFor(unsignedToken) {
  return crypto.createHmac('sha256', getSecret()).update(unsignedToken).digest('base64url');
}

function signAccessToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    avatar: user.avatar || '',
    iss: ISSUER,
    aud: AUDIENCE,
    iat: now,
    exp: now + ACCESS_TOKEN_TTL_SECONDS,
    jti: crypto.randomUUID(),
  });
  const unsignedToken = `${header}.${payload}`;
  return `${unsignedToken}.${signatureFor(unsignedToken)}`;
}

function verifyAccessToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('JWT malformado.');

  const [headerPart, payloadPart, signature] = parts;
  const header = decode(headerPart);
  if (header.alg !== 'HS256' || header.typ !== 'JWT') throw new Error('JWT no admitido.');

  const expected = signatureFor(`${headerPart}.${payloadPart}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw new Error('Firma JWT inválida.');
  }

  const payload = decode(payloadPart);
  const now = Math.floor(Date.now() / 1000);
  if (!payload.sub || payload.iss !== ISSUER || payload.aud !== AUDIENCE || payload.exp <= now) {
    throw new Error('JWT expirado o con claims inválidos.');
  }
  return payload;
}

module.exports = { signAccessToken, verifyAccessToken, ACCESS_TOKEN_TTL_SECONDS };
