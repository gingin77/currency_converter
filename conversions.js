const mongoose             = require('mongoose');
const currencyNames        = require('./references/currency_names_codes.json')
const { getExchangeRates } = require('./rates');

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
    baseRate: { type: Number, required: false },
    convertToRate: { type: Number, required: false },
    inputAmount: { type: Number, required: true },
    outputAmout: { type: Number, required: false },
    ratePublicationTime: { type: Date, required: false },
    conversionTime: {
        type: Date,
        default: Date.now(),
        required: false
    }
});

const Conversion = mongoose.model('Conversion', conversionSchema);

async function collectConversionProperties(inputs) {
    const { baseCurrencyName, convertToCurrencyName, inputAmount } = inputs;
    
    const userInputs = new Object({
        baseCurrency: currencyNames[baseCurrencyName],
        convertToCurrency: currencyNames[convertToCurrencyName],
        inputAmount: inputAmount
    })

    try {
        const rateApiResponse  = await getExchangeRates(userInputs.baseCurrency, userInputs.convertToCurrency);
        const { rates } = rateApiResponse;

        const baseRate      = rates[userInputs.baseCurrency];
        const convertToRate = rates[userInputs.convertToCurrency]

        const conversionProperties = Object.assign(
            userInputs, {
                baseRate: baseRate,
                convertToRate: convertToRate,
                ratePublicationTime: (rateApiResponse.timestamp * 1000),
                outputAmout: inputAmount * 1 / baseRate * convertToRate
            }
        )
        createConversion(conversionProperties);
    }
    catch(exception) {
        console.log(exception.message);
    }
}

async function createConversion(conversionInputs) {
    const conversion = new Conversion(conversionInputs);

    try {
        const result = await conversion.save();
        console.log(result);
        db.close();
    }
    catch (ex) {
        console.log(ex.message);
    }
}

module.exports = { collectConversionProperties };