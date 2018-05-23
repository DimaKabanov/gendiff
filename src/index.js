// @flow

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parser';
import getRender from './renderings';

const propertyActions = [
  {
    type: 'added',
    check: ({ nodeBefore }) => !nodeBefore,
    extendNode: ({ nodeAfter }) => ({ newValue: nodeAfter }),
  },
  {
    type: 'deleted',
    check: ({ nodeAfter }) => !nodeAfter,
    extendNode: ({ nodeBefore }) => ({ oldValue: nodeBefore }),
  },
  {
    type: 'nested',
    check: ({ nodeBefore, nodeAfter }) => _.isPlainObject(nodeBefore) && _.isPlainObject(nodeAfter),
    extendNode: ({ nodeBefore, nodeAfter, depth, buildAst }) =>
      ({ children: buildAst(nodeBefore, nodeAfter, depth + 1) }),
  },
  {
    type: 'unchanged',
    check: ({ nodeBefore, nodeAfter }) => nodeBefore === nodeAfter,
    extendNode: ({ nodeBefore }) => ({ oldValue: nodeBefore }),
  },
  {
    type: 'changed',
    check: ({ nodeBefore, nodeAfter }) => nodeBefore !== nodeAfter,
    extendNode: ({ nodeBefore, nodeAfter }) => ({ oldValue: nodeBefore, newValue: nodeAfter }),
  },
];

const getPropertyAction = (nodeBefore, nodeAfter) =>
  _.find(propertyActions, ({ check }) => check({ nodeBefore, nodeAfter }));

const buildAst = (objBefore, objAfter, depth = 1) => {
  const uniqKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));

  return uniqKeys.map((key) => {
    const nodeBefore = objBefore[key];
    const nodeAfter = objAfter[key];

    const { type, extendNode } = getPropertyAction(nodeBefore, nodeAfter);

    return { type, key, depth, ...extendNode({ nodeBefore, nodeAfter, depth, buildAst }) };
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
