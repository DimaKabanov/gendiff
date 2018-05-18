// @flow

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parser';

const propertyActions = [
  {
    type: 'added',
    check: ({ objBefore, key }) => !_.has(objBefore, key),
    getValue: ({ objAfter, key }) => objAfter[key],
  },
  {
    type: 'deleted',
    check: ({ objAfter, key }) => !_.has(objAfter, key),
    getValue: ({ objBefore, key }) => objBefore[key],
  },
  {
    type: 'unchanged',
    check: ({ objBefore, objAfter, key }) => objBefore[key] === objAfter[key],
    getValue: ({ objBefore, key }) => objBefore[key],
  },
  {
    type: 'changed',
    check: ({ objBefore, objAfter, key }) => objBefore[key] !== objAfter[key],
    getValue: ({ objBefore, objAfter, key }) =>
      ({ newValue: objAfter[key], oldValue: objBefore[key] }),
  },
];

const getPropertyAction = (objBefore, objAfter, key) =>
  _.find(propertyActions, ({ check }) => check({ objBefore, objAfter, key }));

const createAst = (objBefore, objAfter) => {
  const uniqKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));

  return uniqKeys.map((key) => {
    const { getValue, type } = getPropertyAction(objBefore, objAfter, key);
    const value = getValue({ objBefore, objAfter, key });

    return {
      name: key,
      value,
      type,
    };
  });
};

const renderString = (ast): string => {
  const result = ast.map((obj) => {
    const { name, value, type } = obj;

    switch (type) {
      case 'unchanged':
        return `    ${name}: ${value}`;
      case 'deleted':
        return `  - ${name}: ${value}`;
      case 'changed':
        return `  - ${name}: ${value.oldValue}\n  + ${name}: ${value.newValue}`;
      case 'added':
        return `  + ${name}: ${value}`;
      default:
        throw new Error(`Incorrect type '${type}'`);
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
