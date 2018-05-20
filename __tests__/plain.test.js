import fs from 'fs';
import genDiff from '../src';

const pathToOutput = '__tests__/__fixtures__/output/plainOutput';
const pathToOutputNested = '__tests__/__fixtures__/output/plainOutputNested';

const pathToBeforeJson = '__tests__/__fixtures__/json/before.json';
const pathToAfterJson = '__tests__/__fixtures__/json/after.json';
const pathToBeforeNestedJson = '__tests__/__fixtures__/json/before-nested.json';
const pathToAfterNestedJson = '__tests__/__fixtures__/json/after-nested.json';

const pathToBeforeYaml = '__tests__/__fixtures__/yaml/before.yml';
const pathToAfterYaml = '__tests__/__fixtures__/yaml/after.yml';
const pathToBeforeNestedYaml = '__tests__/__fixtures__/yaml/before-nested.yml';
const pathToAfterNestedYaml = '__tests__/__fixtures__/yaml/after-nested.yml';

const pathToBeforeIni = '__tests__/__fixtures__/ini/before.ini';
const pathToAfterIni = '__tests__/__fixtures__/ini/after.ini';
const pathToBeforeNestedIni = '__tests__/__fixtures__/ini/before-nested.ini';
const pathToAfterNestedIni = '__tests__/__fixtures__/ini/after-nested.ini';

describe('Difference of plain flat structure', () => {
  test('check flat json', () => {
    const actual = genDiff(pathToBeforeJson, pathToAfterJson, 'plain');
    const expected = fs.readFileSync(pathToOutput, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check flat yaml', () => {
    const actual = genDiff(pathToBeforeYaml, pathToAfterYaml, 'plain');
    const expected = fs.readFileSync(pathToOutput, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check flat ini', () => {
    const actual = genDiff(pathToBeforeIni, pathToAfterIni, 'plain');
    const expected = fs.readFileSync(pathToOutput, 'utf8');
    expect(actual).toBe(expected);
  });
});

describe('Difference of plain nested structures', () => {
  test('check nested json', () => {
    const actual = genDiff(pathToBeforeNestedJson, pathToAfterNestedJson, 'plain');
    const expected = fs.readFileSync(pathToOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check nested yaml', () => {
    const actual = genDiff(pathToBeforeNestedYaml, pathToAfterNestedYaml, 'plain');
    const expected = fs.readFileSync(pathToOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check nested ini', () => {
    const actual = genDiff(pathToBeforeNestedIni, pathToAfterNestedIni, 'plain');
    const expected = fs.readFileSync(pathToOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });
});
