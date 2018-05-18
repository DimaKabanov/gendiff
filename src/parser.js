// @flow

import yamlParse from 'js-yaml';
import iniParse from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yamlParse.safeLoad,
  '.yml': yamlParse.safeLoad,
  '.ini': iniParse.parse,
};

const getParser = (firstExp: string, secondExp: string) => (data) => {
  if (firstExp !== secondExp) {
    throw new Error('File formats must be the same');
  }

  const parseData = parsers[firstExp];
  return parseData(data);
};

export default getParser;
