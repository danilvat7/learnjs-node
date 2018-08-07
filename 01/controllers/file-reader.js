const fs = require('fs');
const path = require('path');
exports.read = (filePath, cb) =>    {
   
    
    fs.readFile(path.join(__dirname, '..', 'public', 'index.html'), (err, data)=>{
        if (err) throw err;
       
        cb(data);
        
    });
};