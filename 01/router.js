const urlParser = require('url');
const handlers = require('./handlers');

class Router {
  constructor() {}

  parseUrl(url) {
    return urlParser.parse(url, true);
  }

  handler(req, res) {
    const url = this.parseUrl(req.url);
    const path = url.pathname.replace('/', '');
    const handler = handlers[path];

    if (handler) return handler;

    // console.log(handlers[path]);

    // const handler = handlers[path][method];

    // return handler;
  }
};

module.exports = Router;