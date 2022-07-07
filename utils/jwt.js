const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.generateToken = (payload) => jwt.sign(
  payload,
  NODE_ENV === 'production'
    ? JWT_SECRET
    : 'dev-secret',
  { expiresIn: '7d' },
);
