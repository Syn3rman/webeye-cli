#!/usr/bin/env node
'use strict';

const program = require('commander');
const setup = require('../lib/setup');
const utilities = require('../lib/utilities');

program
  .version('0.0.1')
  .description('Personalized URL shortener with tracking capabilities.')

program
  .command('login')
  .alias('L')
  .description('Log into your account.')
  .action(()=>{setup.login()})

program
  .command('set-key')
  .alias('S')
  .description('Set your api key to access resources.')
  .action(()=>setup.setKey())

program
  .command('shorten <originalUrl>')
  .alias('s')
  .description('Shorten a url. ')
  .action((originalUrl)=>utilities.shorten(originalUrl))
  
  
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

program.parse(process.argv);