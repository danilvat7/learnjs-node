const path = require('path');
const url = require('url');
const utils = require('./http-helpers');

const fileCtrl = require('../controllers/file-reader');

const endpoints = {
  '/index.html': async () => {
    try {
      const data = await fileCtrl.read();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
};

const actions = {
  GET: async (req, res) => {
    var parsedUrl = url.parse(req.url);
    var endPoint =
      parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;

    if (!endpoints[endPoint]) return utils.send404(res);
    try {
      const data = await endpoints[endPoint]();
      utils.respond(res, data, 200);
    } catch (error) {}
  },
  POST: (req, res) => {
    utils.prepareResponse(req, data => {
      // Do something with the data that was just collected by the helper
      // e.g., validate and save to db
      // either redirect or respond
      // should be based on result of the operation performed in response to the POST request intent
      // e.g., if user wants to save, and save fails, throw error
      utils.redirector(
        res /* redirect path , optional status code -  defaults to 302 */
      );
    });
  },
  DELETE: (req, res) => {}
};

exports.handleRequest = (req, res) => {
  const action = actions[req.method];
  action ? action(req, res) : utils.send404(res);
};
