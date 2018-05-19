// @flow

import _ from 'lodash';

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

const render = (ast, startDepth = 0): string => {
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
        return `${addIndent(depth)}${name}: ${render(children, depth)}`;
      default:
        throw new Error(`Incorrect type '${type}'`);
    }
  });

  return `{\n${result.join('\n')}\n${addIndent(startDepth)}}`;
};

export default render;
