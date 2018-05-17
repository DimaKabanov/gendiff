import fs from 'fs';
import genDiff from '../src';

const pathToCorrectOutput = '__tests__/__fixtures__/correctOutput';
const pathToCorrectOutputNested = '__tests__/__fixtures__/correctOutputNested';

const pathToBeforeJson = '__tests__/__fixtures__/before.json';
const pathToAfterJson = '__tests__/__fixtures__/after.json';
const pathToBeforeNestedJson = '__tests__/__fixtures__/before-nested.json';
const pathToAfterNestedJson = '__tests__/__fixtures__/after-nested.json';

const pathToBeforeYaml = '__tests__/__fixtures__/before.yml';
const pathToAfterYaml = '__tests__/__fixtures__/after.yml';
const pathToBeforeNestedYaml = '__tests__/__fixtures__/before-nested.yml';
const pathToAfterNestedYaml = '__tests__/__fixtures__/after-nested.yml';

const pathToBeforeIni = '__tests__/__fixtures__/before.ini';
const pathToAfterIni = '__tests__/__fixtures__/after.ini';
const pathToBeforeNestedIni = '__tests__/__fixtures__/before-nested.ini';
const pathToAfterNestedIni = '__tests__/__fixtures__/after-nested.ini';

describe('Difference of flat structures', () => {
  test('check flat json', () => {
    const actual = genDiff(pathToBeforeJson, pathToAfterJson);
    const expected = fs.readFileSync(pathToCorrectOutput, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check flat yaml', () => {
    const actual = genDiff(pathToBeforeYaml, pathToAfterYaml);
    const expected = fs.readFileSync(pathToCorrectOutput, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check flat ini', () => {
    const actual = genDiff(pathToBeforeIni, pathToAfterIni);
    const expected = fs.readFileSync(pathToCorrectOutput, 'utf8');
    expect(actual).toBe(expected);
  });
});

describe('Difference of nested structures', () => {
  test('check nested json', () => {
    const actual = genDiff(pathToBeforeNestedJson, pathToAfterNestedJson);
    const expected = fs.readFileSync(pathToCorrectOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check nested yaml', () => {
    const actual = genDiff(pathToBeforeNestedYaml, pathToAfterNestedYaml);
    const expected = fs.readFileSync(pathToCorrectOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check nested ini', () => {
    const actual = genDiff(pathToBeforeNestedIni, pathToAfterNestedIni);
    const expected = fs.readFileSync(pathToCorrectOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });
});
