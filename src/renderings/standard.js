// @flow

import _ from 'lodash';

const addIndent = (depth, sign = ' ') => {
  const tabSize = 4;
  const strIndent = `${' '.repeat(depth * tabSize)}`;
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
  const astToStr = (node: any): any => {
    const { type, key, depth, oldValue, newValue, children } = node;

    switch (type) {
      case 'added':
        return `${addIndent(depth, '+')}${key}: ${objToStr(newValue, depth)}`;
      case 'deleted':
        return `${addIndent(depth, '-')}${key}: ${objToStr(oldValue, depth)}`;
      case 'unchanged':
        return `${addIndent(depth)}${key}: ${objToStr(oldValue, depth)}`;
      case 'changed':
        return [`${addIndent(depth, '-')}${key}: ${objToStr(oldValue, depth)}`,
          `${addIndent(depth, '+')}${key}: ${objToStr(newValue, depth)}`];
      case 'nested':
        return `${addIndent(depth)}${key}: ${render(children, depth)}`;
      default:
        throw new Error(`Incorrect type '${type}'`);
    }
  };

  return `{\n${_.flatten(ast.map(astToStr)).join('\n')}\n${addIndent(startDepth)}}`;
};

export default render;
