import fs from 'fs';
import genDiff from '../src';

const pathToCorrectOutput = '__tests__/__fixtures__/correctOutput';

const pathToBeforeJson = '__tests__/__fixtures__/before.json';
const pathToAfterJson = '__tests__/__fixtures__/after.json';

const pathToBeforeYaml = '__tests__/__fixtures__/before.yml';
const pathToAfterYaml = '__tests__/__fixtures__/after.yml';

describe('GenDiff', () => {
  test('check json', () => {
    const actual = genDiff(pathToBeforeJson, pathToAfterJson);
    const expected = fs.readFileSync(pathToCorrectOutput, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check yaml', () => {
    const actual = genDiff(pathToBeforeYaml, pathToAfterYaml);
    const expected = fs.readFileSync(pathToCorrectOutput, 'utf8');
    expect(actual).toBe(expected);
  });
});
