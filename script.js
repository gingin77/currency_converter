#!/usr/bin/env node

const program = require('commander');
const { collectConversionProperties } = require('./conversions');

var inquirer = require('inquirer');

program
    .version('0.0.1')

const questions = [
    {
        type: "list",
        name: "baseCurrencyName",
        message: "Choose a base currency type to convert from:",
        choices: [
            "United States Dollar",
            "Bitcoin",
            "Brazilian Real",
            "Euro",
            "Fijian Dollar",
            "Icelandic Króna",
            "Japanese Yen",
            "Moroccan Dirham",
            "Russian Ruble",
            "Tanzanian Shilling"
        ]
    },
    {
        type: "list",
        name: "convertToCurrencyName",
        message: "Choose a currency type to convert to:",
        choices: [
            "United States Dollar",
            "Bitcoin",
            "Brazilian Real",
            "Euro",
            "Fijian Dollar",
            "Icelandic Króna",
            "Japanese Yen",
            "Moroccan Dirham",
            "Russian Ruble",
            "Tanzanian Shilling"
        ]
    },
    {
        type: "input",
        name: "inputAmount",
        message: "How much do you want to convert?"
    }
];

const initialPrompt = inquirer.createPromptModule();

program
    .command('convert')
    .description('Collect inputs for currency conversion')
    .action(() => {
        initialPrompt(questions)
            .then(answers => {
                collectConversionProperties(answers)
            });
    });

program.parse(process.argv);