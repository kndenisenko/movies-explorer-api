class NoFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoValidIdError';
    this.statusCode = 404;
  }
}

module.exports = { NoFoundError };
