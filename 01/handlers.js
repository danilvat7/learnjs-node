const handlers = {};

handlers.file = (data, res) => {
    var acceptableMethods = ['post', 'get', 'delete'];
    console.log('!!!!', data);
    res.end('Hello');
};

module.exports = handlers;