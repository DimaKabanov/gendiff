// @flow

import _ from 'lodash';

const objToStr = (obj) => {
  if (_.isPlainObject(obj)) {
    return 'complex value';
  }
  return `'${obj}'`;
};

const render = (ast: any, path: any = []): string => {
  const astToStr = (node: any): any => {
    const { type, key, oldValue, newValue, children } = node;

    switch (type) {
      case 'added':
        return `Property '${[...path, key].join('.')}' was added with ${objToStr(newValue)}`;
      case 'deleted':
        return `Property '${[...path, key].join('.')}' was removed`;
      case 'changed':
        return `Property '${[...path, key].join('.')}' was updated from ${objToStr(oldValue)} to ${objToStr(newValue)}`;
      case 'nested':
        return render(children, [...path, key]);
      default:
        throw new Error(`Incorrect type '${type}'`);
    }
  };

  return ast.filter(node => node.type !== 'unchanged').map(astToStr).join('\n');
};

export default render;
