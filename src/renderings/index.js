// @flow

import standardRender from './standard';
import plainRender from './plain';

const getRender = (format: string = 'standard') => {
  const rendereTable = {
    standard: standardRender,
    plain: plainRender,
  };

  return rendereTable[format];
};

export default getRender;
