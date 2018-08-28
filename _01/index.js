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
        
        if(req.headers['content-length'] > 1048576) {
            res.statusCode = 401;
            res.end('File bigger than 1mb');
        }
        let body = '';
        req.on('data', data =>{
            body += data;
        });
        req.on('end', () =>{
           
            const post = querystring.parse(body);
            console.log(req.headers);
            //fs.writeFile(`${__dirname}/files/`,)
            res.end('file');
        });
      }

      break;

    default:
      res.statusCode = 502;
      res.end('Not implemented');
      break;
  }
}
