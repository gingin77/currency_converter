#!/usr/bin/env node

const program = require('commander');
const {
  createConversion,
  closeConnection
} = require('./conversions');

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();

const questions = require('./references/questions');

program
  .version('0.0.1')

function prettyPrintConversion(result) {
  console.log(`Pretty printed...\n ${result}`)
}

function endConvert(result) {
  prettyPrintConversion(result);
  closeConnection();
}

program
  .command('convert')
  .description('Promts user to submit currencies and value for conversion')
  .action(() => {
    prompt(questions)
      .then(answers => {
        let output = new Promise((resolve, reject) => {
          resolve(createConversion(answers));
          reject(new Error('The conversion failed to process'));
        });
        output
          .then(result => endConvert(result))
          .catch(err => console.log('Error', err.message));
      });
  });

program.parse(process.argv);