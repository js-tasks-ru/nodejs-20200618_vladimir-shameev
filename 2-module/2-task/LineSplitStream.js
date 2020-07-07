const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.last = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkAsString = chunk.toString();

    if (chunkAsString.includes(os.EOL)) {
      const parts = chunk.toString().split(os.EOL);
      const last = parts.pop();

      parts.forEach((item) => {
        callback(null, this.last + item);
      });

      this.last = last;
    } else {
      this.last = this.last + chunkAsString;
      callback();
    }
  }

  _flush(callback) {
    callback(null, this.last);
  }
}

module.exports = LineSplitStream;
