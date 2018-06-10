#!/usr/bin/env node

var program = require('commander');
var inquirer = require('inquirer');

program
    .version('0.0.1')
    .parse(process.argv)

let questions = [
    {
        type: "list",
        name: "currency type",
        message: "Choose a currency type to convert to:",
        choices: [
            "Tanzanian Shilling",
            "Fijian Dollar",
            "Bitcoin",
            "Brazilian Real",
            "Euro",
            "Icelandic Króna",
            "Japanese Yen",
            "Moroccan Dirham",
            "Russian Ruble"
        ]
    },
    {
        type: "input",
        name: "amount",
        message: "How much do you want to convert?"
    }
];

let prompt_1 = inquirer.createPromptModule();
prompt_1(questions)
    .then(answers => { console.log(answers) });
