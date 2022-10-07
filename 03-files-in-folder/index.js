const { Dirent, stat } = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

fsPromises
  .readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((filenames) => {
    for (let filename of filenames) {
      if (filename.isFile()) {
        stat(
          path.join(__dirname, 'secret-folder', filename.name),
          (err, stat) => {
            console.log(
              `${path.basename(
                filename.name,
                path.extname(filename.name)
              )} - ${path.extname(filename.name).slice(1)} - ${
                stat.size / 1024
              }kb`
            );
          }
        );
      }
    }
  })

  .catch((err) => {
    console.log(err);
  });
