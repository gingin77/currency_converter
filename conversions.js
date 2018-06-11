const mongoose = require('mongoose');
const currencyNames = require('./references/currency_names_codes.json')
const {
  getExchangeRates
} = require('./rates');

mongoose.connect('mongodb://localhost/currency_converter')
  .catch(err => console.error('Could not connect to the database...', err));

const db = mongoose.connection;

const conversionSchema = mongoose.Schema({
  baseCurrency: {
    type: String,
    default: 'USD',
    required: true
  },
  convertToCurrency: {
    type: String,
    default: 'JPY',
    required: true
  },
  baseRate: {
    type: Number,
    required: false
  },
  convertToRate: {
    type: Number,
    required: false
  },
  inputAmount: {
    type: Number,
    required: true
  },
  outputAmout: {
    type: Number,
    required: false
  },
  ratePublicationTime: {
    type: Date,
    required: false
  },
  conversionTime: {
    type: Date,
    default: Date.now(),
    required: false
  }
});

const Conversion = mongoose.model('Conversion', conversionSchema);

function organizeinputs(answers) {
  const {
    baseCurrencyName,
    convertToCurrencyName,
    inputAmount
  } = answers;

  return {
    baseCurrency: currencyNames[baseCurrencyName],
    convertToCurrency: currencyNames[convertToCurrencyName],
    inputAmount: inputAmount
  }
}

async function getRatesObject(inputs) {
  try {
    const [base, convert] = [inputs.baseCurrency, inputs.convertToCurrency];
    const rateApiResponse = await getExchangeRates(base, convert);

    const { rates } = rateApiResponse;
    const ratePublicationTime = rateApiResponse.timestamp * 1000;

    const ratesObject = {
      baseRate: rates[inputs.baseCurrency],
      convertToRate: rates[inputs.convertToCurrency],
      ratePublicationTime: ratePublicationTime
    }
    return ratesObject
  }
  catch (ex) {
    console.log(ex.message);
  }
}

function calculateConversion(rates, inputs) {
  const ratesRatio = 1 / rates.baseRate * rates.convertToRate
  const product = inputs.inputAmount * ratesRatio

  return { outputAmout: product }
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

function closeConnection() {
  db.close();
}

module.exports = {
  createConversion,
  closeConnection
};