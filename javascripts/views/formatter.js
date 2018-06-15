const moment                = require('moment');
const pluralize             = require('pluralize');
const columnify             = require("columnify");
const getSymbolFromCurrency = require("currency-symbol-map");

function namePluralizer(amount, currencyName) {
  const factor = amount > 1 ? 2 : 1;

  return currencyName == "Japanese Yen" ? currencyName : pluralize(currencyName, factor);
}

function valueFormatter(amount) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatString(isoCode, amount, currencyName, type) {
  const symbol = getSymbolFromCurrency(isoCode);
  const value = valueFormatter(amount);
  const name = namePluralizer(amount, currencyName);

  if (type == "input") {
    return `${symbol} ${value} ${name}`
  } else {
    return ({
      [`${symbol} ${value}`]: name
    })
  }
}

function conversionsAsColumns(outputStringsForColumnify){
  console.log(columnify(outputStringsForColumnify, {
    columns: ["Value", "Currency"],
    minWidth: 16,
    config: {
      Value: { align: "right" }
    }
  }))
}

function newConversionMessageTemplate(details) {
  const { inputString,
          outputStrings,
          conversionNumberDependentString,
          ratePublicationTimeF,
          rateObject,
          conversionTimeF } = details;

  const outputStringsForColumnify = Object.assign({}, ...outputStrings)
 
  console.log(`
${inputString} is valued at:`)
  conversionsAsColumns(outputStringsForColumnify)
  console.log(`
${conversionNumberDependentString} calculated based on exchange rates from openexchangerates.org posted on ${ratePublicationTimeF}.

Exchange rates are set with respect to one US Dollar ($1.00).
  ${columnify(rateObject, { columns: ["Currency", "Rate"], minWidth: 40 })}

This conversion was retrieved on ${conversionTimeF}.
  `);
}

function historicConversionMessageTemplate(details) {
  const { inputString,
    outputStrings,
    conversionNumberDependentString,
    ratePublicationTimeF,
    rateObject,
    conversionTimeF } = details;

  const outputStringsForColumnify = Object.assign({}, ...outputStrings)

  console.log(`\nThe following details pertain to the last conversion stored in the database.\n
${inputString} was valued at:`)
  conversionsAsColumns(outputStringsForColumnify)
  console.log(`
${conversionNumberDependentString} calculated on ${conversionTimeF} using rates published by openexchangerates.org on ${ratePublicationTimeF}.

At the time, the exchange rates were:
${columnify(rateObject, { columns: ["Currency", "Rate"], minWidth: 40 })}

Exchange rates are set with respect to one US Dollar ($1.00).\n
`);
}

function messageTimeFormatter(time) {
  return moment(time).format("dddd, MMMM Do, YYYY [at] h:mm a");
}

function listTimeFormat(time) {
  return moment(time).format("h:mm a, MM/DD/YYYY");
}

function prettyPrintRecordsInList(records) {
  const recordsObj = records.map(r => ({
    input_Value: valueFormatter(r.inputAmount),
    currency_Base: r.baseCurrencyName,
    base_rate: r.baseRate.toFixed(4),
    output_Value: valueFormatter(r.outputAmount),
    currency_Converting_To: r.convertToCurrencyName,
    convert_to_rate: r.convertToRate.toFixed(4),
    rate_Pub_Time: listTimeFormat(r.ratePublicationTime),
    conversion_Time: listTimeFormat(r.conversionTime)
  }));

  const currencyName = records[0].convertToCurrencyName;

  console.log(`
Here are your most recent conversions into ${namePluralizer(2, currencyName)}:
  
${columnify(recordsObj, {
    config: {
      input_Value: { align: "right", minWidth: 16 },
      currency_Base: { minWidth: 30 },
      output_Value: { align: "right", minWidth: 16 },
      currency_Converting_To: { minWidth: 30 },
      base_rate: { align: "center", minWidth: 10 },
      convert_to_rate: { align: "center", minWidth: 10 },
      rate_Pub_Time: { align: "center", minWidth: 30 }
    }
  })}\n
If you would like to access more details from your currency conversion history, you \ncan export all of you conversions to a CSV file with the 'csv-export' option.`);
}

function conversionPluralization(length) {
  if (length > 1) {
    return "These currency conversions were";
  } else {
    return "This currency conversion was";
  }
}

function prettyPrintConversion(conversion, newRecordStatus) {
  const {
    conversionTime,
    name,
    iso,
    amount,
    convertTo,
    ratePublicationTime,
    rate
  } = conversion;

  const inputString = formatString(iso, amount, name, "input");
  const outputStrings = convertTo.map(c => {
    return formatString(c.iso, c.amount, c.name, "output");
  });

  const conversionNumberDependentString = conversionPluralization(convertTo.length);
  const ratePublicationTimeF = messageTimeFormatter(ratePublicationTime);
  const conversionTimeF = messageTimeFormatter(conversionTime);
  const convertToRates1 = convertTo.map(c => {
    return { [c.name]: c.rate.toFixed(4) }
  });
  convertToRates = Object.assign({}, ...convertToRates1)
  
  const rateObject = Object.assign({ [name]: rate.toFixed(4) }, convertToRates);
    
  const details = {
    inputString: inputString,
    outputStrings: outputStrings,
    conversionNumberDependentString: conversionNumberDependentString,
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

module.exports = { prettyPrintConversion, prettyPrintRecordsInList };