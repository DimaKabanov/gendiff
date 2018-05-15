// @flow

import fs from 'fs';
import _ from 'lodash';

const genDiff = (pathToFileBefore: string, pathToFileAfter: string) => {
  const dataFileBefore = fs.readFileSync(pathToFileBefore, 'utf8');
  const dataFileAfter = fs.readFileSync(pathToFileAfter, 'utf8');
};

export default genDiff;
