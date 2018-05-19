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
    type: 'nested',
    check: ({ objBefore, objAfter, key }) =>
      _.isPlainObject(objBefore[key]) && _.isPlainObject(objAfter[key]),
    getValue: () => '',
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

const createAst = (objBefore, objAfter, depth = 1) => {
  const uniqKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));

  return uniqKeys.map((key) => {
    const { getValue, type } = getPropertyAction(objBefore, objAfter, key);

    const value = getValue({ objBefore, objAfter, key });
    const children = type === 'nested' ? [...createAst(objBefore[key], objAfter[key], depth + 1)] : [];

    return {
      name: key,
      value,
      type,
      children,
      depth,
    };
  });
};

const addIndent = (depth, sign = ' ') => {
  const strIndent = `${' '.repeat(4 * depth)}`;
  const arrIndent = strIndent.split('');
  const indexToReplace = arrIndent.length - 2;
  return arrIndent.map((item, index) => (index === indexToReplace ? sign : item)).join('');
};

const stringifyObj = (obj, depth) => {
  if (!_.isPlainObject(obj)) {
    return obj;
  }

  const result = Object.keys(obj).map(key => `${addIndent(depth + 1)}${key}: ${obj[key]}`);

  return `{\n${result.join('\n')}\n${addIndent(depth)}}`;
};

const renderString = (ast, startDepth = 0): string => {
  const result = ast.map((obj) => {
    const {
      name,
      value,
      type,
      children,
      depth,
    } = obj;

    const strValue = _.isPlainObject(value) ? stringifyObj(value, depth) : value;

    switch (type) {
      case 'added':
        return `${addIndent(depth, '+')}${name}: ${strValue}`;
      case 'deleted':
        return `${addIndent(depth, '-')}${name}: ${strValue}`;
      case 'unchanged':
        return `${addIndent(depth)}${name}: ${strValue}`;
      case 'changed':
        return `${addIndent(depth, '-')}${name}: ${stringifyObj(value.oldValue, depth)}\n${addIndent(depth, '+')}${name}: ${stringifyObj(value.newValue, depth)}`;
      case 'nested':
        return `${addIndent(depth)}${name}: ${renderString(children, depth)}`;
      default:
        throw new Error(`Incorrect type '${type}'`);
    }
  });

  return `{\n${result.join('\n')}\n${addIndent(startDepth)}}`;
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
