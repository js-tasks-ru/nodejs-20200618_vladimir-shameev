const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const {ACCESS_DECLINED_MSG, EXIST_MSG, MAX_FILE_SIZE_MSG, UNEXPECTED_ERROR_MSG} = require('./messages');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end(ACCESS_DECLINED_MSG);
      } else {
        fs.exists(filepath, (state) => {
          if (state) {
            res.statusCode = 409;
            res.end(EXIST_MSG);
          } else {
            const fileWriteStream = fs.createWriteStream(filepath);
            const limitSizeStream = new LimitSizeStream({limit: 1000000});

            limitSizeStream.on('error', (err) => {
              if (err instanceof LimitExceededError) {
                fileWriteStream.destroy();
                fs.unlink(filepath, (err) => {
                  if (err) {
                    res.statusCode = 500;
                    res.end(UNEXPECTED_ERROR_MSG);
                  } else {
                    res.statusCode = 413;
                    res.end(MAX_FILE_SIZE_MSG);
                  }
                });
              } else {
                res.statusCode = 500;
                res.end(UNEXPECTED_ERROR_MSG);
              }
            });

            fileWriteStream.on('finish', () => {
              res.statusCode = 201;
              res.end();
            });

            req.pipe(limitSizeStream).pipe(fileWriteStream);
          }
        });

        req.on('aborted', () => {
          fs.unlinkSync(filepath);
        });
      }

      break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

module.exports = server;
