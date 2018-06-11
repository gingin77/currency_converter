#!/usr/bin/env node

const program  = require('commander');
const inquirer = require('inquirer');
const moment   = require('moment');
const pluralize = require('pluralize');

const questions = require('./lib/questions');
const prompt    = inquirer.createPromptModule();

const getSymbolFromCurrency = require("currency-symbol-map");

const {
  createConversion,
  closeConnection
} = require('./conversions')

program
  .version('0.0.1')

function prettyPrintConversion(conversion) {
  const {
    baseISO,
    convertToISO,
    baseCurrencyName,
    convertToCurrencyName,
    baseRate,
    convertToRate,
    inputAmount,
    outputAmount,
    ratePublicationTime,
    conversionTime
  } = conversion;

  const basePl = inputAmount > 1 ? 2 : 1;
  const convertPl = outputAmount > 1 ? 2 : 1;

  const inputAmountF = `${
    getSymbolFromCurrency(baseISO)}${
      inputAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }`;
  const outputAmountF = `${getSymbolFromCurrency(convertToISO)}${outputAmount.toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )}`;
  
  console.log(`
  The amount of ${inputAmountF} ${pluralize(baseCurrencyName, basePl)}
  Is valued at ${outputAmountF} ${pluralize(convertToCurrencyName, convertPl)},
  Based on exchange rates posted at openexchangerates.org on ${moment(ratePublicationTime).format("dddd, MMMM Do, YYYY, h:mm a")}.

  Exchange rates are set with respect to one US Dollar ($1.00).
  The rate for the ${baseCurrencyName} is ${baseRate.toFixed(4)}.
  The rate for the ${convertToCurrencyName} is ${convertToRate.toFixed(4)}.

  This conversion was retrieved on ${moment(conversionTime).format("dddd, MMMM Do, YYYY, h:mm a")}.
  `);
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