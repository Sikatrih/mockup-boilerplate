const fs = require('fs');
const path = require('path');

const grabFiles = (filesPath, fileExt) => {
  filesPath = filesPath || '';
  filesPath = path.resolve(__dirname, '../', filesPath);

  return fs.readdirSync(filesPath)
    .map(file => {
      return path.resolve(filesPath, file);
    })
    .filter(file => {
      const isFile = fs.lstatSync(file).isFile();
      const extRegExp = new RegExp(`\.${fileExt}`)
      const isFitToExt = fileExt && extRegExp.test(file);

      return isFile && isFitToExt;
    });
};

const getFileName = (file) => {
  const fileParts = file.split('/');
  const filename = fileParts[fileParts.length - 1].replace(/\.[^.]*$/, '');

  return filename;
}

exports.grabFiles = grabFiles;
exports.getFileName = getFileName;
