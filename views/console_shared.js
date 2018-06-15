const moment = require("moment");
const pluralize = require('pluralize');
const columnify = require("columnify");
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

function conversionsAsColumns(outputStringsForColumnify) {
  console.log(columnify(outputStringsForColumnify, {
    columns: ["Value", "Currency"],
    minWidth: 16,
    config: {
      Value: { align: "right" }
    }
  }))
}

function conversionPluralization(length) {
  if (length > 1) {
    return "These currency conversions were";
  } else {
    return "This currency conversion was";
  }
}

function messageTimeFormatter(time) {
  return moment(time).format("dddd, MMMM Do, YYYY [at] h:mm a");
}

function listTimeFormat(time) {
  return moment(time).format("h:mm a, MM/DD/YYYY");
}

module.exports = {
  namePluralizer,
  valueFormatter,
  formatString,
  conversionsAsColumns,
  conversionPluralization,
  messageTimeFormatter,
  listTimeFormat
};