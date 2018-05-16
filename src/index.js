// @flow

import fs from 'fs';
import _ from 'lodash';

const propertyActions = [
  {
    status: 'deleted',
    check: (firstObj, secondObj, key) => !_.has(secondObj, key),
    getData: (firstObj, secondObj, key) => firstObj[key],
  },
  {
    status: 'added',
    check: (firstObj, secondObj, key) => !_.has(firstObj, key),
    getData: (firstObj, secondObj, key) => secondObj[key],
  },
  {
    status: 'unchanged',
    check: (firstObj, secondObj, key) => _.has(secondObj, key) && firstObj[key] === secondObj[key],
    getData: (firstObj, secondObj, key) => firstObj[key],
  },
  {
    status: 'changed',
    check: (firstObj, secondObj, key) => _.has(secondObj, key) && firstObj[key] !== secondObj[key],
    getData: (firstObj, secondObj, key) => ({ newData: secondObj[key], oldData: firstObj[key] }),
  },
];

const getPropertyAction = (firstObj, secondObj, key) =>
  _.find(propertyActions, ({ check }) => check(firstObj, secondObj, key));

const createAst = (objBefore, objAfter) => {
  const uniqKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));

  return uniqKeys.map((key) => {
    const { getData, status } = getPropertyAction(objBefore, objAfter, key);
    const data = getData(objBefore, objAfter, key);

    return {
      name: key,
      data,
      status,
    };
  });
};

const renderString = (ast) => {
  const result = ast.map((obj) => {
    const { name, data, status } = obj;

    switch (status) {
      case 'unchanged':
        return `    ${name}: ${data}\n`;
      case 'deleted':
        return `  - ${name}: ${data}\n`;
      case 'changed':
        return `  - ${name}: ${data.oldData}\n  + ${name}: ${data.newData}\n`;
      case 'added':
        return `  + ${name}: ${data}\n`;
      default:
        throw new Error(`Incorrect status '${status}'`);
    }
  });

  return `{\n${result.join('')}}`;
};

const genDiff = (pathToFileBefore: string, pathToFileAfter: string): string => {
  const dataFileBefore = fs.readFileSync(pathToFileBefore, 'utf8');
  const dataFileAfter = fs.readFileSync(pathToFileAfter, 'utf8');

  const objBefore = JSON.parse(dataFileBefore);
  const objAfter = JSON.parse(dataFileAfter);

  const ast = createAst(objBefore, objAfter);
  return renderString(ast);
};

export default genDiff;
