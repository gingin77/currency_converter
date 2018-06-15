const mongoose = require('mongoose');
const db       = mongoose.connection;

mongoose.connect('mongodb://localhost/currency_converter')
  .catch(err => console.error('Could not connect to the database...', err));

const currencyNames        = require('../lib/currency_names_codes.json');
const { getExchangeRates } = require("../javascripts/rates");
const { Conversion }       = require('./models/conversion')

function organizeInputs(answers) {
  const {
    baseCurrencyName,
    convertToCurrencyNames,
    inputAmount
  } = answers;

  const convertToObject = convertToCurrencyNames.map(name => ({
    name: name,
    iso: currencyNames[name]
  }));
  
  return {
    name: baseCurrencyName,
    iso: currencyNames[baseCurrencyName],
    amount: inputAmount,
    convertToNames: convertToObject,
  }
}

async function getRatesObject(inputs) {
  try {
    const base = inputs.iso;
    const convert = inputs.convertToNames.map(c => c.iso);
    const rateApiResponse = await getExchangeRates(base, convert);

    const { rates } = rateApiResponse;
    const ratePublicationTime = rateApiResponse.timestamp * 1000;
    
    const convertToOutputs = convert.map(currency => ({
      iso: currency,
      rate: rates[currency]
    }))

    const ratesObject = { 
      baseRate: rates[inputs.iso],
      convertToRate: convertToOutputs,
      ratePublicationTime: ratePublicationTime
    };
    return ratesObject

  }
  catch (ex) {
    console.log(`Im the catch message for getRatesObject: ${ex.message}`);
  }
}

function calculateConversion(rates, inputAmount) {
  const baseRate = rates.baseRate;

  return rates.convertToRate.map(convertTo => {
    let amount = inputAmount * 1 / baseRate * convertTo.rate;
    return Object.assign(convertTo, { amount: amount })
  });
}

async function createConversion(answers) {
  const inputs = organizeInputs(answers);

  try {
    const rates = await getRatesObject(inputs);
    const convertToData = calculateConversion(rates, inputs.amount);
    const convertTo = []

    inputs.convertToNames.forEach((object, index) => {
      convertTo.push(Object.assign({}, object, convertToData[index]));
    }, this);

    delete inputs.convertToNames;

    const conversion = new Conversion(Object.assign(
      inputs,
      { convertTo: convertTo },
      { 
        ratePublicationTime: rates.ratePublicationTime,
        rate: rates.baseRate
      }
    ));
    const document = await conversion.save();
    return document
  }
  catch (ex) {
    console.log(`Im the error(s) for createConversion....\n${ex.message}
    THE END`);
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
    const conversions = await Conversion.aggregate([
      { $match: { 'convertTo.name': queryCurrency } },
      {
        $project: {
          _id: 0,
          conversionTime: 1,
          name: 1,
          amount: 1,
          ratePublicationTime: 1,
          rate: 1,
          convertTo: {
            $filter: {
              input: '$convertTo',
              as: 'convertTo',
              cond: { $eq: ['$$convertTo.name', queryCurrency] }
            }
          }
        }
      }
    ])
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

module.exports = {
  createConversion,
  getLastConversion,
  getLastTenConversions,
  getTenConversionsByCurrency,
  getAllConversionRecords,
  closeConnection
};