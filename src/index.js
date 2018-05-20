// @flow

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parser';
import getRender from './renderings';

const propertyActions = [
  {
    type: 'added',
    check: ({ before }) => !before,
    buildNode: ({ type, key, after, depth }) => ({ type, key, after, depth }),
  },
  {
    type: 'deleted',
    check: ({ after }) => !after,
    buildNode: ({ type, key, before, depth }) => ({ type, key, before, depth }),
  },
  {
    type: 'nested',
    check: ({ before, after }) => _.isPlainObject(before) && _.isPlainObject(after),
    buildNode: ({ type, key, before, after, depth, buildAst }) =>
      ({ type, key, depth, children: buildAst(before, after, depth + 1) }),
  },
  {
    type: 'unchanged',
    check: ({ before, after }) => before === after,
    buildNode: ({ type, key, before, depth }) => ({ type, key, before, depth }),
  },
  {
    check: ({ before, after }) => before !== after,
    buildNode: ({ key, after, before, depth }) => {
      const oldNode = { type: 'deleted', key, before, depth };
      const newNode = { type: 'added', key, after, depth };
      return [oldNode, newNode];
    },
  },
];

const getPropertyAction = (before, after) =>
  _.find(propertyActions, ({ check }) => check({ before, after }));

const buildAst = (objBefore, objAfter, depth = 1) => {
  const uniqKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));

  return uniqKeys.map((key) => {
    const before = objBefore[key];
    const after = objAfter[key];

    const { type, buildNode } = getPropertyAction(before, after);

    return buildNode({ type, key, before, after, depth, buildAst });
  });
};

const genDiff = (pathToFileBefore: string, pathToFileAfter: string, format: string): string => {
  const dataFileBefore = fs.readFileSync(pathToFileBefore, 'utf8');
  const dataFileAfter = fs.readFileSync(pathToFileAfter, 'utf8');

  const extFileBefore = path.extname(pathToFileBefore);
  const extFileAfter = path.extname(pathToFileAfter);

  const getParseredData = getParser(extFileBefore, extFileAfter);

  const objBefore = getParseredData(dataFileBefore);
  const objAfter = getParseredData(dataFileAfter);

  const ast = buildAst(objBefore, objAfter);

  const getRenderedData = getRender(format);

  return getRenderedData(ast);
};

export default genDiff;
