const currencyChoices = [
  "United States Dollar",
  "Bitcoin",
  "Brazilian Real",
  "Euro",
  "Fijian Dollar",
  "Icelandic Króna",
  "Japanese Yen",
  "Moroccan Dirham",
  "Russian Ruble",
  "Tanzanian Shilling",
  "United Arab Emirates Dirham"
];

const createQuestions = [
  {
    type: "list",
    name: "baseCurrencyName",
    message: "Choose a base currency type to convert from:",
    choices: currencyChoices
  },
  {
    type: "list",
    name: "convertToCurrencyName",
    message: "Choose a currency type to convert to:",
    choices: currencyChoices
  },
  {
    type: "input",
    name: "inputAmount",
    message: "How much do you want to convert?"
  }
]

const queryQuestions = [
  {
    type: "list",
    name: "queryCurrency",
    message: "Which convert-to currency do you want conversion records for?",
    choices: currencyChoices
  }
];

const csvQuestions = [
  {
    type: "input",
    name: "fileName",
    message: "Enter a name for your csv-formatted database backup:",
    validate: function (value) {
      let valid = /[a-zA-Z-_0-9]*\.csv/.test(value);
      return valid || "Enter a string ending with the .csv extension; Letters, numbers, underscores, and dashes are allowed";
    },
  },
  {
    type: "input",
    name: "filePath",
    message: "Optional: Enter a file path to save your backup to:",
    default: "."
  },
];

module.exports = {
  createQuestions: createQuestions,
  queryQuestions: queryQuestions,
  csvQuestions: csvQuestions
};