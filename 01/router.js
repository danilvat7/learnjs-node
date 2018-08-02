const urlParser = require('url');

 class Router {
  constructor() {
  }

  parseUrl(url) {
      return urlParser.parse(url, true);
  }

  handler(req) {
    const url = this.parseUrl(req.url);
    console.log(url.pathname);
    
  }
};

module.exports = Router;