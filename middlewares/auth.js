const AuthError = require('../errors/auth-err');
const { checkToken } = require('../utils/jwt');

module.exports.auth = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new AuthError('Сначала авторизуйтесь');
  }

  try {
    const payload = checkToken(jwt);
    req.user = payload;
  } catch (err) {
    throw new AuthError('Сначала авторизуйтесь');
  }
  next();
};
