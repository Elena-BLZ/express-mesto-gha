const jwt = require('jsonwebtoken');

// const { NODE_ENV, JWT_SECRET } = process.env;
// обходимся пока без .env

const JWT_SECRET = '13a01e56d21457e036818fdbeb1d17065bdb04d597ac5dffb3976f15289b08fb';

module.exports.generateToken = (payload) => jwt.sign(
  payload,
  // NODE_ENV === 'production'
  //   ? JWT_SECRET
  //   : 'dev-secret',
  JWT_SECRET,
  { expiresIn: '7d' },
);
module.exports.checkToken = (token) => jwt.verify(
  token,
  // NODE_ENV === 'production'
  //   ? JWT_SECRET
  //   : 'dev-secret',
  JWT_SECRET,
);
