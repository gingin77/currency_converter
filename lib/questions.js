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
  "Tanzanian Shilling"
]

module.exports = [
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