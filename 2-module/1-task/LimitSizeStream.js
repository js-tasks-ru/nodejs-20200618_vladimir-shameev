const {Transform} = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends Transform {
  constructor(options) {
    super(options);
    this.streamDataLength = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const newStreamDataLength = this.streamDataLength + chunk.length;

    if (newStreamDataLength <= this.limit) {
      this.streamDataLength = newStreamDataLength;
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
