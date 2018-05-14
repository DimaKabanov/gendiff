#!/usr/bin/env node

import commander from 'commander';

commander
  .version('0.0.2')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format')
  .description('Compares two configuration files and shows a difference.')
  .parse(process.argv);
