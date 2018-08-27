const path = require('path');
const url = require('url');
const utils = require('./http-helpers');

const fileCtrl = require('../controllers/file-reader');

const endpoints = {
  '/index.html': cb => {
    fileCtrl.read('public/index.html', (err, data) => {
      cb(err, data);
    });
  },
  '/file': (req, cb) => {
    cb(null, req.data);
  }
};

function urlParser(urlForParse) {
  const parsedUrl = url.parse(urlForParse);
  return parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
}
const actions = {
  GET: (req, res) => {
    const endPoint = urlParser(req.url);

    if (!endpoints[endPoint]) return utils.send404(res);

    endpoints[endPoint]((err, data) => {
      if (err) {
        utils.respond(res, err.toString(), 500);
      } {
        utils.respond(res, data, 200);
      }
    });
  },
  POST: (req, res) => {
    const endPoint = urlParser(req.url);

    if (!endpoints[endPoint]) return utils.send404(res);

    endpoints[endPoint](req, (err, data) => {
      if (err) {
        utils.respond(res, err.toString(), 500);
      } else {
        utils.respond(res, 'Ok', 200);
        console.log(data);
      }
    });

    utils.prepareResponse(req, data => {
      console.log(data);
      res.end('200');
      // utils.redirector(
      //   res /* redirect path , optional status code -  defaults to 302 */
      // );
    });
  },
  DELETE: (req, res) => {}
};

exports.handleRequest = (req, res) => {
  const action = actions[req.method];
  action ? action(req, res) : utils.send404(res);
};