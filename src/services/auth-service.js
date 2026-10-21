const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../repositories/user-repository');

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith('CHANGE_ME')) {
    const error = new Error('JWT_SECRET must be set to a unique random value of at least 32 characters');
    error.status = 500;
    error.code = 'JWT_SECRET_NOT_CONFIGURED';
    throw error;
  }
  return secret;
}

function publicUser(user) {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };
}

function issueToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, name: user.name },
    jwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h', issuer: 'bankfix-api', audience: 'bankfix-client' }
  );
}

async function register({ name, email, password }) {
  jwtSecret(); // Validate configuration before creating the account.
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await users.create({ name, email, passwordHash });
  return { user: publicUser(user), token: issueToken(user) };
}

async function login({ email, password }) {
  const user = await users.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
  return { user: publicUser(user), token: issueToken(user) };
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret(), {
    issuer: 'bankfix-api',
    audience: 'bankfix-client'
  });
}

async function getPublicUser(id) {
  const user = await users.findPublicById(id);
  return user ? publicUser(user) : null;
}

module.exports = { register, login, verifyToken, getPublicUser };
