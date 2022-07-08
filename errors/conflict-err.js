const {
  EMAIL_CONFLICT,
} = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = EMAIL_CONFLICT;
  }
}

module.exports = ConflictError;
