const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {ACCESS_DECLINED_MSG, NOT_FOUND_MSG, DELETE_FILE_SUCCESS_MSG} = require('./messages');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end(ACCESS_DECLINED_MSG);
      } else {
        fs.unlink(filepath, (err) => {
          if (err) {
            res.statusCode = 404;
            res.end(NOT_FOUND_MSG);
          } else {
            res.statusCode = 200;
            res.end(DELETE_FILE_SUCCESS_MSG);
          }
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
