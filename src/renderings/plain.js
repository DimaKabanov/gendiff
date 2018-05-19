// @flow

// import _ from 'lodash';

const render = (ast: any): string => {
  const result = ast.map((obj: any): any => {
    const { name, value, type, children, } = obj; // eslint-disable-line

    switch (type) {
      case 'unchanged':
        return '';
      case 'added':
        return `Property '${name}' was added with '${value}'`;
      case 'deleted':
        return `Property '${name}' was removed`;
      case 'changed':
        return `Property '${name}' was updated from '${value.oldValue}' to '${value.newValue}'`;
      // case 'nested':
      default:
        throw new Error(`Incorrect type '${type}'`);
    }
  });

  return result.filter(item => item).join('\n');
};

export default render;
