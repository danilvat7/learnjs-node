var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'Content-Type': 'application/json',
  'Content-Type': 'text/html;charset=utf-8'
};

exports.prepareResponse = (req, cb) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    cb(data);
  });
};

exports.respond = (res, data, status) => {
  status = status || 200;
  res.writeHead(status, headers);

  res.end(data);
};

exports.send404 = (res, loc, status) => {
  exports.respond(res, 'Not Found', 404);
};

exports.redirector = function(res, loc, status) {
  status = status || 302;
  res.writeHead(status, { Location: loc });
  res.end();
};
