// @flow

import standardRender from './standard';
import plainRender from './plain';
import jsonRender from './json';

const getRender = (format: string = 'standard') => {
  const rendereTable = {
    standard: standardRender,
    plain: plainRender,
    json: jsonRender,
  };

  return rendereTable[format];
};

export default getRender;
