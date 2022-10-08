const { unlink, readdir, mkdir, copyFile } = require('fs/promises');
const { stat } = require('fs');
const path = require('path');

function copyDir() {
  mkdir(path.join(__dirname, 'files-copy'), { recursive: true }).then(
    readdir(path.join(__dirname, 'files'))
      .then((filenames) => {
        for (let filename of filenames) {
          copyFile(
            path.join(__dirname, 'files', filename),
            path.join(__dirname, 'files-copy', filename)
          );
        }
      })
      .catch((err) => {
        console.log(err);
      })
  );
}

stat(path.join(__dirname, 'files-copy'), function (err, stats) {
  if (err) {
    copyDir();
  } else {
    readdir(path.join(__dirname, 'files-copy'))
      .then((filenames) => {
        for (let filename of filenames) {
          unlink(path.join(__dirname, 'files-copy', filename));
        }
      })
      .then(copyDir());
  }
});
