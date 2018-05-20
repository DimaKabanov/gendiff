// @flow

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parser';
import getRender from './renderings';

const propertyActions = [
  {
    type: 'added',
    check: ({ itemObjBefore }) => !itemObjBefore,
    buildNode: ({ type, key, itemObjAfter, depth }) => ({ type, key, itemObjAfter, depth }),
  },
  {
    type: 'deleted',
    check: ({ itemObjAfter }) => !itemObjAfter,
    buildNode: ({ type, key, itemObjBefore, depth }) => ({ type, key, itemObjBefore, depth }),
  },
  {
    type: 'nested',
    check: ({ itemObjBefore, itemObjAfter }) =>
      _.isPlainObject(itemObjBefore) && _.isPlainObject(itemObjAfter),
    buildNode: ({ type, key, itemObjBefore, itemObjAfter, depth, buildAst }) =>
      ({ type, key, depth, children: buildAst(itemObjBefore, itemObjAfter, depth + 1) }),
  },
  {
    type: 'unchanged',
    check: ({ itemObjBefore, itemObjAfter }) => itemObjBefore === itemObjAfter,
    buildNode: ({ type, key, itemObjBefore, depth }) => ({ type, key, itemObjBefore, depth }),
  },
  {
    check: ({ itemObjBefore, itemObjAfter }) => itemObjBefore !== itemObjAfter,
    buildNode: ({ key, itemObjAfter, itemObjBefore, depth }) => {
      const oldNode = { type: 'deleted', key, itemObjBefore, depth };
      const newNode = { type: 'added', key, itemObjAfter, depth };
      return [oldNode, newNode];
    },
  },
];

const getPropertyAction = (itemObjBefore, itemObjAfter) =>
  _.find(propertyActions, ({ check }) => check({ itemObjBefore, itemObjAfter }));

const buildAst = (objBefore, objAfter, depth = 1) => {
  const uniqKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));

  return uniqKeys.map((key) => {
    const itemObjBefore = objBefore[key];
    const itemObjAfter = objAfter[key];

    const { type, buildNode } = getPropertyAction(itemObjBefore, itemObjAfter);

    return buildNode({ type, key, itemObjBefore, itemObjAfter, depth, buildAst });
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
