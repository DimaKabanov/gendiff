import path from 'path';

const folders = {
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.ini': 'ini',
};

const getFixturePath = fileName =>
  path.join('__tests__/__fixtures__/', folders[path.extname(fileName)], fileName);

export default getFixturePath;
