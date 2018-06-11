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

function newConversionMessageTemplate(details) {
  const { inputString,
    outputString,
    ratePublicationTimeF,
    rateObject,
    conversionTimeF } = details;

  console.log(`\n
The amount of:  ${inputString}
Is valued at:  ${outputString}

The conversion value was calculated based on exchange rates from openexchangerates.org
posted on ${ratePublicationTimeF}.

Exchange rates are set with respect to one US Dollar ($1.00).\n
  ${columnify(rateObject, {
    columns: ["Currency", "Rate"],
    minWidth: 40
  })}

This conversion was retrieved on ${conversionTimeF}.
  `);
}

function historicConversionMessageTemplate(details) {
  const { inputString,
    outputString,
    ratePublicationTimeF,
    rateObject,
    conversionTimeF } = details;

  console.log(`\nThe following details pertain to the last conversion stored in the database.\n
The amount of:  ${inputString}
Was valued at:  ${outputString}

This conversion was calculated on ${conversionTimeF} using rates published
by openexchangerates.org on ${ratePublicationTimeF}.

At the time, the exchange rates were:
${columnify(rateObject, { columns: ["Currency", "Rate"], minWidth: 40 })}

Exchange rates are set with respect to one US Dollar ($1.00).\n
`);
}

function prettyPrintConversion(conversion, newRecordStatus) {
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
  const outputString = formatString(
    convertToISO,
    outputAmount,
    convertToCurrencyName
  );
  const ratePublicationTimeF = moment(ratePublicationTime).format(
    "dddd, MMMM Do, YYYY [at] h:mm a"
  );
  const conversionTimeF = moment(conversionTime).format(
    "dddd, MMMM Do, YYYY [at] h:mm a"
  );

  const rateObject = {
    [baseCurrencyName]: baseRate.toFixed(4),
    [convertToCurrencyName]: convertToRate.toFixed(4)
  };

  const details = {
    inputString: inputString,
    outputString: outputString,
    ratePublicationTimeF: ratePublicationTimeF,
    rateObject: rateObject,
    conversionTimeF: conversionTimeF
   };

  if (newRecordStatus) {
    newConversionMessageTemplate(details);
  } else {
    historicConversionMessageTemplate(details);
  }
}

module.exports = { prettyPrintConversion };
