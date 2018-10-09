const clients = [];

exports.renderIndex = async (ctx, next) => {
    await ctx.render('index');
}

exports.subscribe = async (ctx, next) => {

    clients.push(ctx.res);
}

exports.publish = async (ctx, next) => {
    ctx.body = ctx.request.body.message;
    console.log(clients[0]);
    // clients.forEach(res => {
    //     console.log(res);
        
    // });
}