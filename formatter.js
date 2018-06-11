const moment = require('moment');
const pluralize = require('pluralize');
const columnify = require("columnify");
const getSymbolFromCurrency = require("currency-symbol-map");

function namePluralizer(amount, currencyName) {
  const factor = amount > 1 ? 2 : 1;

  if (currencyName != "Japanese Yen") {
    return pluralize(currencyName, factor);
  } else {
    return currencyName;
  }
}

function formatString(isoCode, amount, currencyName) {
  const symbol = getSymbolFromCurrency(isoCode);
  const value = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });  
  const name = namePluralizer(amount, currencyName);

  return `${symbol} ${value} ${name}`;
}

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

  const inputString = formatString(baseISO, inputAmount, baseCurrencyName);
  const outputString = formatString(convertToISO, outputAmount, convertToCurrencyName);
  const ratePublicationTimeF = moment(ratePublicationTime).format("dddd, MMMM Do, YYYY [at] h:mm a")
  const conversionTimeF = moment(conversionTime).format("dddd, MMMM Do, YYYY [at] h:mm a");

  const rateObject = { 
    [baseCurrencyName]: baseRate.toFixed(4),
    [convertToCurrencyName]: convertToRate.toFixed(4)
  };

  console.log(`\n
The amount of             ${inputString}
Is valued at              ${outputString}

The conversion value was calculated based on exchange rates from openexchangerates.org
posted on ${ratePublicationTimeF}.

Exchange rates are set with respect to one US Dollar ($1.00).\n
  ${
  columnify(rateObject, {
    columns: ["Currency", "Rate"],
    minWidth: 40,
  })
  }

This conversion was retrieved on ${conversionTimeF}.
  `);
}

module.exports = { prettyPrintConversion }
