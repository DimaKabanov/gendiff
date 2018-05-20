// @flow

import _ from 'lodash';

const addIndent = (depth, sign = ' ') => {
  const strIndent = `${' '.repeat(4 * depth)}`;
  const arrIndent = strIndent.split('');
  const indexToReplace = arrIndent.length - 2;
  return arrIndent.map((item, index) => (index === indexToReplace ? sign : item)).join('');
};

const objToStr = (obj, depth) => {
  if (!_.isPlainObject(obj)) {
    return obj;
  }
  const result = Object.keys(obj).map(key => `${addIndent(depth + 1)}${key}: ${obj[key]}`);
  return `{\n${result.join('\n')}\n${addIndent(depth)}}`;
};

const render = (ast: any, startDepth: number = 0): string => {
  const result = _.flatten(ast).map((node) => {
    const { key, before, after, type, children, depth } = node;

    switch (type) {
      case 'added':
        return `${addIndent(depth, '+')}${key}: ${objToStr(after, depth)}`;
      case 'deleted':
        return `${addIndent(depth, '-')}${key}: ${objToStr(before, depth)}`;
      case 'unchanged':
        return `${addIndent(depth)}${key}: ${objToStr(before, depth)}`;
      case 'nested':
        return `${addIndent(depth)}${key}: ${render(children, depth)}`;
      default:
        throw new Error(`Incorrect type '${type}'`);
    }
  });

  return `{\n${result.join('\n')}\n${addIndent(startDepth)}}`;
};

export default render;
