const http = require('http');
const url = require('url');
const Router = require('./router');

const router = new Router()

const server = http.createServer((req, res)=>{
    router.handler(req)
    res.end('Hello')
});

server.listen(3000);

