const mongoose = require('mongoose');
const db       = mongoose.connection;

mongoose.connect('mongodb://localhost/currency_converter')
  .catch(err => console.error('Could not connect to the database...', err));

const currencyNames        = require('../lib/currency_names_codes.json');
const { getExchangeRates } = require("../javascripts/rates");
const { Conversion }       = require('./models/conversion')

function organizeinputs(answers) {
  const {
    baseCurrencyName,
    convertToCurrencyName,
    inputAmount
  } = answers;

  return {
    baseCurrencyName: baseCurrencyName,
    convertToCurrencyName: convertToCurrencyName,
    baseISO: currencyNames[baseCurrencyName],
    convertToISO: currencyNames[convertToCurrencyName],
    inputAmount: inputAmount
  }
}

async function getRatesObject(inputs) {
  try {
    const [base, convert] = [inputs.baseISO, inputs.convertToISO];
    const rateApiResponse = await getExchangeRates(base, convert);

    const { rates } = rateApiResponse;
    const ratePublicationTime = rateApiResponse.timestamp * 1000;

    const ratesObject = {
      baseRate: rates[inputs.baseISO],
      convertToRate: rates[inputs.convertToISO],
      ratePublicationTime: ratePublicationTime
    }
    return ratesObject

  }
  catch (ex) {
    console.log(ex.message);
  }
}

function calculateConversion(rates, inputs) {
  const ratesRatio = 1 / rates.baseRate * rates.convertToRate;
  const product = inputs.inputAmount * ratesRatio;

  return { outputAmount: product }
}

async function createConversion(answers) {
  const inputs = organizeinputs(answers);

  try {
    const rates = await getRatesObject(inputs);
    const outputAmount = calculateConversion(rates, inputs);

    const conversion = new Conversion(
      Object.assign(inputs, rates, outputAmount)
    );
    const document = await conversion.save();
    return document

  }
  catch (ex) {
    console.log(ex.message);
  }
}

async function getLastConversion() {
  try {
    const conversion = await Conversion
      .find()
      .sort({ _id: -1 })
      .limit(1);
    return conversion[0]

  }
  catch (ex) {
    console.log(ex.message);
  }
}

async function getLastTenConversions() {
  try {
    const conversions = await Conversion
      .find()
      .sort({ _id: -1 })
      .limit(10);
    return conversions;

  } catch (ex) {
    console.log(ex.message);
  }
}

async function getTenConversionsByCurrency(currency) {
  const { queryCurrency } = currency

  try {
    const conversions = await Conversion
      .find({ convertToCurrencyName: queryCurrency })
      .sort({ _id: -1 })
      .limit(10);
    return conversions;

  } catch (ex) {
    console.log(`Query Error ${ex.message}`);
  }
}

async function getAllConversionRecords() {
  try {
    const conversions = await Conversion
      .find()
      .sort({ _id: -1 })

    return conversions;
  }  catch (ex) {
    console.log(`Query Error ${ex.message}`);
  }
}

function closeConnection() {
  db.close();
}

function testConsoleLogger() {
  console.log("This test function works!")
}

module.exports = {
  createConversion,
  getLastConversion,
  getLastTenConversions,
  getTenConversionsByCurrency,
  getAllConversionRecords,
  closeConnection,
  testConsoleLogger
};