const path = require('path');
const paths = require('./paths');
const { grabFiles, getFileName } = require('./utils');

const getTwigData = (context) => {
  const dataJsonPath = path.resolve(paths.src, 'mocks/twig-data.json');
  const packageJsonPath = path.resolve(paths.src, '..', 'package.json');

  const data = context.fs.readJsonSync(dataJsonPath, { throws: false }) || {};
  const package = context.fs.readJsonSync(packageJsonPath, { throws: false }) || {};

  data.pages = grabFiles('src/templates', 'twig').map(file => getFileName(file));
  data.package = package;

  context.addDependency(dataJsonPath); // Force webpack to watch file

  return data
}

exports.getTwigData = getTwigData;
