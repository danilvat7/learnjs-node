const fs = require('fs');
const path = require('path');
function getPath(filePath) {
  return path.join(__dirname, '..', filePath);
}
exports.read = (filePath, cb) => {
  fs.readFile(getPath(filePath), (err, data) => {
    cb(err, data);
  });
};
