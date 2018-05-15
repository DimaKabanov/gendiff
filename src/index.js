// @flow

import fs from 'fs';
import _ from 'lodash';

const generateStringWithDiff = (objBefore, objAfter) => {
  const keysObjBefore = Object.keys(objBefore);
  const keysObjAfter = Object.keys(objAfter);

  const newItem = keysObjAfter.filter(item => !_.has(objBefore, item));

  const result = keysObjBefore.map((key) => {
    if (_.has(objAfter, key) && objBefore[key] === objAfter[key]) {
      return `    ${key}: ${objBefore[key]}\n`;
    } else if (_.has(objAfter, key) && objBefore[key] !== objAfter[key]) {
      return `  - ${key}: ${objBefore[key]}\n  + ${key}: ${objAfter[key]}\n`;
    }
    return `  - ${key}: ${objBefore[key]}\n`;
  });

  return `{\n${result.join('')}}`;
};

const genDiff = (pathToFileBefore: string, pathToFileAfter: string) => {
  const dataFileBefore = fs.readFileSync(pathToFileBefore, 'utf8');
  const dataFileAfter = fs.readFileSync(pathToFileAfter, 'utf8');

  const objBefore = JSON.parse(dataFileBefore);
  const objAfter = JSON.parse(dataFileAfter);

  return generateStringWithDiff(objBefore, objAfter);
};

export default genDiff;
