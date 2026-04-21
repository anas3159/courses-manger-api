class myError extends Error {
  constructor() {
    super();
  }
  create(statusCode, message, resText) {
    this.statusCode = statusCode;
    this.message = message;
    this.resText = resText;
    return this;
  }
}
module.exports = new myError();
