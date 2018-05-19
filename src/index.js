// @flow

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parser';

const propertyActions = [
  {
    type: 'added',
    check: ({ objBefore, key }) => !_.has(objBefore, key),
    extendNode: ({ objAfter, key, depth }) => ({ value: objAfter[key], depth }),
  },
  {
    type: 'deleted',
    check: ({ objAfter, key }) => !_.has(objAfter, key),
    extendNode: ({ objBefore, key, depth }) => ({ value: objBefore[key], depth }),
  },
  {
    type: 'nested',
    check: ({ objBefore, objAfter, key }) =>
      _.isPlainObject(objBefore[key]) && _.isPlainObject(objAfter[key]),
    extendNode: ({ objBefore, objAfter, key, depth, createAst }) => // eslint-disable-line
      ({ children: [...createAst(objBefore[key], objAfter[key], depth + 1)], depth }),
  },
  {
    type: 'unchanged',
    check: ({ objBefore, objAfter, key }) => objBefore[key] === objAfter[key],
    extendNode: ({ objBefore, key, depth }) => ({ value: objBefore[key], depth }),
  },
  {
    type: 'changed',
    check: ({ objBefore, objAfter, key }) => objBefore[key] !== objAfter[key],
    extendNode: ({ objBefore, objAfter, key, depth }) => // eslint-disable-line
      ({ value: { newValue: objAfter[key], oldValue: objBefore[key] }, depth }),
  },
];

const getPropertyAction = (objBefore, objAfter, key) =>
  _.find(propertyActions, ({ check }) => check({ objBefore, objAfter, key }));

const createAst = (objBefore, objAfter, depth = 1) => {
  const uniqKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));

  return uniqKeys.map((key) => {
    const { extendNode, type } = getPropertyAction(objBefore, objAfter, key);

    return { ...extendNode({ objBefore, objAfter, key, depth, createAst }), name: key, type }; // eslint-disable-line
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
    const { name, value, type, children, depth, } = obj; // eslint-disable-line

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
