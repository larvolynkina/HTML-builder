const path = require('path');
const { readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');

const writeStream = createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  'utf8'
);

readdir(path.join(__dirname, 'styles'), { withFileTypes: true }).then(
  (filenames) => {
    for (let filename of filenames) {
      if (filename.isFile() && path.extname(filename.name) === '.css') {
        const readStream = createReadStream(
          path.join(__dirname, 'styles', filename.name),
          'utf8'
        );
        readStream.pipe(writeStream);
      }
    }
  }
);
