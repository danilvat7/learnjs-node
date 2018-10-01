 const Koa = require('koa');
 const app = new Koa();

 const config = require('config');

 const path = require('path');
 const fs = require('fs');

 const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
 handlers.forEach(handler => require('./handlers/' + handler).init(app));

 const router = require('./router');

//  app.use(async ctx => {
//      ctx.body = 'Hello World';
//      await ctx.render('index');
//  });

 app
     .use(router.routes())
     .use(router.allowedMethods());
 app.listen(config.get('port'));