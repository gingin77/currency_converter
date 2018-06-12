#!/usr/bin/env node

const program  = require('commander');
const inquirer = require('inquirer');

const { createQuestions, queryQuestions } = require("./lib/questions");
const prompt    = inquirer.createPromptModule();

const {
  createConversion,
  getLastConversion,
  getLastTenConversions,
  getTenConversionsByCurrency,
  closeConnection
} = require('./conversions')

const {
  prettyPrintConversion,
  prettyPrintRecordsInList
} = require("./formatter");

program
  .version('0.0.1')

function printSingle(result, newRecordStatus) {
  prettyPrintConversion(result, newRecordStatus);
  closeConnection();
}

function printBulk(records) {
  prettyPrintRecordsInList(records);
  closeConnection();
}

program
  .command('convert')
  .description('Promts user to submit currencies and value for conversion')
  .action(() => {
    prompt(createQuestions).then(answers => {
      let output = new Promise((resolve, reject) => {
        resolve(createConversion(answers));
        reject(new Error("The conversion failed to process"));
      });
      output
        .then(result => printSingle(result, true))
        .catch(err => console.log("Error", err.message));
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
      .then(result => printSingle(result, false))
      .catch(err => console.log("Error", err.message));
  });

program
  .command('last-ten')
  .description("Retrieves up to 10 most recent conversions")
  .action(() => {
    let records = new Promise((res, rej) => {
      res(getLastTenConversions());
      rej(new Error("The conversion records were not retrieved"));
    });
    records
      .then(result => printBulk(result))
      .catch(err => console.log("Error", err.message));
  });

program
  .command("query-currency")
  .description("Allows query based on convert-to currency; Max 10 records")
  .action(() => {
    prompt(queryQuestions).then(answer => {
      let records = new Promise((res, rej) => {
        res(getTenConversionsByCurrency(answer));
        rej(new Error("The conversion records were not retrieved"));
      })
      records
        .then(result => printBulk(result))
        .catch(err => console.log("Error", err.message));
    });
  });

program.parse(process.argv);