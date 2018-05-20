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
    if (_.isArray(node)) {
      const [{ key, itemObjBefore }, { itemObjAfter }] = node;

      return `Property '${[...path, key].join('.')}' was updated from ${objToStr(itemObjBefore)} to ${objToStr(itemObjAfter)}`;
    }

    const { key, itemObjAfter, type, children } = node;

    switch (type) {
      case 'added':
        return `Property '${[...path, key].join('.')}' was added with ${objToStr(itemObjAfter)}`;
      case 'deleted':
        return `Property '${[...path, key].join('.')}' was removed`;
      case 'nested':
        return render(children, [...path, key]);
      default:
        throw new Error(`Incorrect type '${type}'`);
    }
  };

  return ast.filter(node => node.type !== 'unchanged').map(astToStr).join('\n');
};

export default render;
