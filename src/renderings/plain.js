// @flow

import _ from 'lodash';

const objToStr = (obj) => {
  if (_.isPlainObject(obj)) {
    return 'complex value';
  }
  return `'${obj}'`;
};

const render = (ast: any, path: any = []): string => {
  const result = ast.map((node: any): any => {
    if (_.isArray(node)) {
      const [{ key, before }, { after }] = node;
      return `Property '${[...path, key].join('.')}' was updated from ${objToStr(before)} to ${objToStr(after)}`;
    }

    const { key, after, type, children } = node;

    switch (type) {
      case 'unchanged':
        return '';
      case 'added':
        return `Property '${[...path, key].join('.')}' was added with ${objToStr(after)}`;
      case 'deleted':
        return `Property '${[...path, key].join('.')}' was removed`;
      case 'nested':
        return render(children, [...path, key]);
      default:
        throw new Error(`Incorrect type '${type}'`);
    }
  });

  return result.filter(item => item).join('\n');
};

export default render;
