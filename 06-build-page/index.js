const {
  unlink,
  readdir,
  mkdir,
  copyFile,
  readFile,
  writeFile,
} = require('fs/promises');
const path = require('path');
const { createReadStream, createWriteStream } = require('fs');

async function toCreateIndexHTML() {
  try {
    const createDir = await mkdir(path.join(__dirname, 'project-dist'), {
      recursive: true,
    });

    const templateCopy = await copyFile(
      path.join(__dirname, 'template.html'),
      path.join(__dirname, 'template-copy.html')
    );

    const filenames = await readdir(path.join(__dirname, 'components'));

    for (const filename of filenames) {
      if (path.extname(filename) === '.html') {
        const replaceName = `{{${filename.slice(0, -5)}}}`;
        const regexp = new RegExp(`${replaceName}`, 'g');

        const filenameContent = await readFile(
          path.join(__dirname, 'components', filename),
          'utf8'
        );

        const templateContent = await readFile(
          path.join(__dirname, 'template-copy.html'),
          'utf8'
        );

        const result = templateContent.replace(regexp, `${filenameContent}`);

        const fixedTemplateContent = await writeFile(
          path.join(__dirname, 'template-copy.html'),
          result,
          'utf8'
        );
      }
    }

    const filledTemplate = await readFile(
      path.join(__dirname, 'template-copy.html'),
      'utf8'
    );

    const indexContent = await writeFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      filledTemplate,
      'utf8'
    );

    const deleteTemplateCopy = await unlink(
      path.join(__dirname, 'template-copy.html')
    );
  } catch (err) {
    console.log(err.message);
  }
}

toCreateIndexHTML();

function toCreateStyleCSS() {
  const writeStream = createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
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
}

toCreateStyleCSS();

async function copyAssets() {
  const createAssetsDir = await mkdir(
    path.join(__dirname, 'project-dist', 'assets'),
    {
      recursive: true,
    }
  );

  const assetsFolders = await readdir(path.join(__dirname, 'assets'));

  for (const folder of assetsFolders) {
    const createFoldersInAssets = await mkdir(
      path.join(__dirname, 'project-dist', 'assets', folder),
      {
        recursive: true,
      }
    );

    const isFolderEmpty = await readdir(
      path.join(__dirname, 'project-dist', 'assets', folder)
    );

    async function copyFiles() {
      const filesInFolder = await readdir(
        path.join(__dirname, 'assets', folder)
      );

      for (const file of filesInFolder) {
        const copyOfFile = await copyFile(
          path.join(__dirname, 'assets', folder, file),
          path.join(__dirname, 'project-dist', 'assets', folder, file)
        );
      }
    }

    if (isFolderEmpty.length === 0) {
      copyFiles();
    } else {
      const oldFiles = await readdir(
        path.join(__dirname, 'project-dist', 'assets', folder)
      );

      for (const file of oldFiles) {
        unlink(path.join(__dirname, 'project-dist', 'assets', folder, file));
      }
      copyFiles();
    }
  }
}

copyAssets();
