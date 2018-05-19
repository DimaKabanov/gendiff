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

const genDiff = (pathToFileBefore: string, pathToFileAfter: string, render: any): string => {
  const dataFileBefore = fs.readFileSync(pathToFileBefore, 'utf8');
  const dataFileAfter = fs.readFileSync(pathToFileAfter, 'utf8');

  const extFileBefore = path.extname(pathToFileBefore);
  const extFileAfter = path.extname(pathToFileAfter);

  const parserData = getParser(extFileBefore, extFileAfter);

  const objBefore = parserData(dataFileBefore);
  const objAfter = parserData(dataFileAfter);

  const ast = createAst(objBefore, objAfter);

  return render(ast);
};

export default genDiff;
