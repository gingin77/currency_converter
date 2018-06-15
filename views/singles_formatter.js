const columnify = require("columnify");
const {
  formatString,
  conversionsAsColumns,
  conversionPluralization,
  messageTimeFormatter,
} = require("./console_shared.js");

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

module.exports = { prettyPrintConversion };