import yamlParse from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yamlParse.safeLoad,
  '.yml': yamlParse.safeLoad,
};

const getParser = (firstExp, secondExp) => (data) => {
  if (firstExp !== secondExp) {
    throw new Error('File formats must be the same');
  }

  const parser = parsers[firstExp];
  return parser(data);
};

export default getParser;
