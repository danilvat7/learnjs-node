const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
exports.read = async (filePath, cb) => {
  try {
    const data = await readFile(
      path.join(__dirname, '..', 'public', 'index.html')
    );

    return data;
  } catch (error) {
    console.log('Error', error);
  }
};
