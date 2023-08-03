module.exports = class NoDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
