const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {NOT_FOUND_ERR_MSG, ACCESS_DECLINED_MSG} = require('./file-messages');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end(ACCESS_DECLINED_MSG);
      } else {
        fs.access(filepath, (err) => {
          if (err) {
            res.statusCode = 404;
            res.end(NOT_FOUND_ERR_MSG);
          } else {
            fs.createReadStream(filepath).pipe(res);
          }
        });
      }

      break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

module.exports = server;
