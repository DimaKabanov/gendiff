import standardRender from './standard';
import plainRender from './plain';

const getRender = (format = 'standard') => {
  const rendereTable = {
    standard: standardRender,
    plain: plainRender,
  };

  return rendereTable[format];
};

export default getRender;
