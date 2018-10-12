let clients = [];

exports.renderIndex = async (ctx, next) => {
  await ctx.render('index');
};

exports.subscribe = async (ctx, next) => {
  ctx.set('Cache-Control', 'no-cache,must-revalidate');

  const promise = new Promise((resolve, reject) => {
    clients.push(resolve);

    ctx.res.on('close', function() {
      clients.splice(clients.indexOf(resolve), 1);
      const error = new Error('Connection closed');
      error.code = 'ECONNRESET';
      reject(error);
    });
  });
  let message;
  try {
    message = await promise;
  } catch (err) {
    if (err.code === 'ECONNRESET') {
      console.log(clients);

      return;
    }
    throw err;
  }
  ctx.body = message;
};

exports.publish = async (ctx, next) => {
  const { message } = ctx.request.body;

  if (!message) ctx.throw(404);

  clients.forEach(function(resolve) {
    resolve(String(message));
  });

  clients = [];
  ctx.body = 'ok';
};
