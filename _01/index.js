const http = require('http');

const server = http.createServer(handlerRequest);
const url = require('url');
const fs = require('fs');
server.listen(3300);

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
      // POST
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
              fs.writeFile(`${__dirname}/files/file`, body, err => {
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
      // DELETE
      if (req.method === 'DELETE') {
        const queryParam = url.parse(req.url).query.split('=')[1];
        fs.readFile(`${__dirname}/files/${queryParam}`, err => {
          if (err) {
            res.statusCode = 404;
            const error = new Error('File not found.');
            res.end(error.toString());
          } else {
            fs.unlink(`${__dirname}/files/${queryParam}`, err => {
              if (err) {
                res.statusCode = 500;
                const error = new Error('Error delete file');
                res.end(error.toString());
              } else {
                res.statusCode = 200;
                res.end('File deleted successfully.');
              }
            });
          }
        });
      }
      // GET
      if (req.method === 'GET') {
        const queryParam = url.parse(req.url).query.split('=')[1];
        fs.readFile(`${__dirname}/files/${queryParam}`, err => {
          if (err) {
            res.statusCode = 404;
            const error = new Error('File not found.');
            res.end(error.toString());
          } else {
            const stream = fs.createReadStream(
              `${__dirname}/files/${queryParam}`
            );
            // let data;
            // stream.on('data', () => {
            //   data = stream.read();
            // });
            // stream.on('end', () => {
            //   console.log('End!!!', data);
            //   res.end(data)
            // });

            // stream.on('error', err => {
            //   console.log('Error!!!',err);

            //   res.statusCode = 500;
            //   const error = new Error('Error donwload file');
            //   res.end(error.toString());
            // });
            let data = '';
            stream.on('data', (chunk)=>{
              data +=chunk
              
            }).on('end',()=>{
              console.log('END');
              res.setHeader('Content-disposition', 'attachment; filename='+'file.txt');
              //res.setHeader('Content-Type', 'application/octet-stream');
              // res.setHeader('Content-Type', 'text/plain')
              res.end(data);
            });
          }
        });
      }
      break;

    default:
      res.statusCode = 502;
      res.end('Not implemented');
      break;
  }
}
