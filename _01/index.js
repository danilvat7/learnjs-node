const http = require('http');

const server = http.createServer(handlerRequest);
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');

server.listen(3300);

const routes = {
  '/': (req, res) => {
    return res.end('qwe');
  }
};

function handlerRequest(req, res) {
  const pathname = decodeURI(url.parse(req.url).pathname);
  switch (pathname) {
    case '/':
      fs.readFile(__dirname + '/public/index.html', (err, data) => {
        if (err) throw err;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(data);
      });
      break;
    case '/file':
      if (req.method === 'POST') {
        if (req.headers['content-length'] > 1048576) {
          res.statusCode = 413;
          const error = new Error('File bigger than 1mb');
          res.end(error.toString());
        }
        fs.readFile(`${__dirname}/files/file`, (err, data) => {
          if (err) {
            let body = '';
            req.on('data', data => {
              body += data;
            });
            req.on('end', () => {
              const post = querystring.parse(body);
              fs.writeFile(`${__dirname}/files/file`, body, (err, data) => {
                if (err) {
                  res.statusCode = 500;
                  const error = new Error('Error loading file');
                  res.end(error.toString());
                } else {
                  res.statusCode = 200;
                  res.end('File uploaded successfully');
                }
              });
            });
          } else {
            res.statusCode = 409;
            const error = new Error('File already exists');
            res.end(error.toString());
          }
        });
      } 

      if (req.method === 'DELETE') {
        console.log(req.url);
        
        res.end('213')
      }
      break;

    default:
      res.statusCode = 502;
      res.end('Not implemented');
      break;
  }
}
