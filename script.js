#!/usr/bin/env node

const program  = require('commander');
const inquirer = require('inquirer');

const questions = require('./lib/questions');
const prompt    = inquirer.createPromptModule();

const {
  createConversion,
  getLastConversion,
  closeConnection
} = require('./conversions')

const {
  prettyPrintConversion
} = require("./formatter");

program
  .version('0.0.1')

function endScript(result, newRecordStatus) {
  prettyPrintConversion(result, newRecordStatus);
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
          .then(result => endScript(result, true))
          .catch(err => console.log('Error', err.message));
      });
  });

program
  .command('last-one')
  .description('Retrieves a record of the last conversion')
  .action(() => {
    let record = new Promise((res,rej) => {
      res(getLastConversion());
      rej(new Error("The last conversion was not retrieved"));
    })
    record
      .then(result => endScript(result, false))
      .catch(err => console.log("Error", err.message));
  });

program.parse(process.argv);