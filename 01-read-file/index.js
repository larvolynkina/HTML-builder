const fs = require('fs');
const path = require('path');

const readStream = new fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf8');
readStream.on('data', (chunk) => console.log(chunk));
