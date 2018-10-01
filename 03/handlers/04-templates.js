const render = require('koa-ejs');
const path = require('path');

exports.init = app => {

  render(app, {
    root: path.join(__dirname, '../views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
  });
}