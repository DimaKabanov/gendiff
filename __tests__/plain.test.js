import fs from 'fs';
import genDiff from '../src';
import getFixturePath from './renderPath';

const pathToOutput = '__tests__/__fixtures__/output/plainOutput';
const pathToOutputNested = '__tests__/__fixtures__/output/plainOutputNested';

const renderFormat = 'plain';

describe('Difference of plain flat structure', () => {
  test('check flat json', () => {
    const actual = genDiff(getFixturePath('before.json'), getFixturePath('after.json'), renderFormat);
    const expected = fs.readFileSync(pathToOutput, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check flat yaml', () => {
    const actual = genDiff(getFixturePath('before.yml'), getFixturePath('after.yml'), renderFormat);
    const expected = fs.readFileSync(pathToOutput, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check flat ini', () => {
    const actual = genDiff(getFixturePath('before.ini'), getFixturePath('after.ini'), renderFormat);
    const expected = fs.readFileSync(pathToOutput, 'utf8');
    expect(actual).toBe(expected);
  });
});

describe('Difference of plain nested structures', () => {
  test('check nested json', () => {
    const actual = genDiff(getFixturePath('before-nested.json'), getFixturePath('after-nested.json'), renderFormat);
    const expected = fs.readFileSync(pathToOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check nested yaml', () => {
    const actual = genDiff(getFixturePath('before-nested.yml'), getFixturePath('after-nested.yml'), renderFormat);
    const expected = fs.readFileSync(pathToOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });

  test('check nested ini', () => {
    const actual = genDiff(getFixturePath('before-nested.ini'), getFixturePath('after-nested.ini'), renderFormat);
    const expected = fs.readFileSync(pathToOutputNested, 'utf8');
    expect(actual).toBe(expected);
  });
});
