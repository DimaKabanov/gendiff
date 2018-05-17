// @flow

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parser';

const propertyActions = [
  {
    status: 'added',
    check: ({ objBefore, key }) => !_.has(objBefore, key),
    getData: ({ objAfter, key }) => objAfter[key],
  },
  {
    status: 'deleted',
    check: ({ objAfter, key }) => !_.has(objAfter, key),
    getData: ({ objBefore, key }) => objBefore[key],
  },
  {
    status: 'unchanged',
    check: ({ objBefore, objAfter, key }) => objBefore[key] === objAfter[key],
    getData: ({ objBefore, key }) => objBefore[key],
  },
  {
    status: 'changed',
    check: ({ objBefore, objAfter, key }) => objBefore[key] !== objAfter[key],
    getData: ({ objBefore, objAfter, key }) =>
      ({ newData: objAfter[key], oldData: objBefore[key] }),
  },
];

const getPropertyAction = (objBefore, objAfter, key) =>
  _.find(propertyActions, ({ check }) => check({ objBefore, objAfter, key }));

const createAst = (objBefore, objAfter) => {
  const uniqKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));

  return uniqKeys.map((key) => {
    const { getData, status } = getPropertyAction(objBefore, objAfter, key);
    const data = getData({ objBefore, objAfter, key });

    return {
      name: key,
      data,
      status,
    };
  });
};

const renderString = (ast): string => {
  const result = ast.map((obj) => {
    const { name, data, status } = obj;

    switch (status) {
      case 'unchanged':
        return `    ${name}: ${data}`;
      case 'deleted':
        return `  - ${name}: ${data}`;
      case 'changed':
        return `  - ${name}: ${data.oldData}\n  + ${name}: ${data.newData}`;
      case 'added':
        return `  + ${name}: ${data}`;
      default:
        throw new Error(`Incorrect status '${status}'`);
    }
  });

  return `{\n${result.join('\n')}\n}`;
};

const genDiff = (pathToFileBefore: string, pathToFileAfter: string): string => {
  const dataFileBefore = fs.readFileSync(pathToFileBefore, 'utf8');
  const dataFileAfter = fs.readFileSync(pathToFileAfter, 'utf8');

  const extFileBefore = path.extname(pathToFileBefore);
  const extFileAfter = path.extname(pathToFileAfter);

  const parserData = getParser(extFileBefore, extFileAfter);

  const objBefore = parserData(dataFileBefore);
  const objAfter = parserData(dataFileAfter);

  const ast = createAst(objBefore, objAfter);

  return renderString(ast);
};

export default genDiff;
