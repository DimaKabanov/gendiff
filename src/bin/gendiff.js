#!/usr/bin/env node

import commander from 'commander';
import genDiff from '..';
import getRender from '../renderings';

commander
  .version('0.0.2')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format')
  .description('Compares two configuration files and shows a difference.')
  .action((firstConfig, secondConfig) => {
    console.log(genDiff(firstConfig, secondConfig, getRender(commander.format)));
  });

commander.parse(process.argv);
