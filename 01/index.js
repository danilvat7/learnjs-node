const http = require('http');
const Router = require('./router');

const router = new Router()

const server = http.createServer((req, res)=>{
    router.handler(req,res);
    console.log(router.handler);
});

server.listen(3000);

