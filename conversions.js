const mongoose            = require('mongoose');
const assert              = require('assert'); 
const { getCurrencyInfo } = require('./rates');

mongoose.connect('mongodb://localhost/currency_converter')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const db = mongoose.connection;

const conversionSchema = mongoose.Schema({
    base_currency: { 
        type: String, 
        default: 'USD',
        required: true
     },
    convert_to_currency: { 
        type: String, 
        default: 'JPY',
        required: true
     },
    rate: { type: Number, required: false },
    input_amount: { type: Number, required: true },
    output_amout: { type: Number, required: false },
    rate_timestamp: { type: Date, required: false },
    conversion_timestamp: { type: Date, required: false }
});

const Conversion = mongoose.model('Conversion', conversionSchema);

async function createConversion() {
    const conversion = new Conversion({
        rate: 109.55,
        input_amount: 10,
        output_amout: 1095.50,
        conversion_timestamp: Date.now()
    });
    
    try {
        const result = await conversion.save();
        console.log(result);
    }
    catch(ex) {
        console.log(ex.message);
    }
}

const addConversion = (conversion) => {
    Conversion.create(conversion, (err) => {
        assert.equal(null, err);
        console.log(conversion);
        console.info('New conversion added');
        db.close();
    });
};

// function createConversionFromInputs(inputs) {
//     const convert_to = {
//         convert_to_currency: 'EUR'
//     }

//     const object2 = Object.assign(convert_to, inputs);

//     console.log(object2);
// }
// Terminal content
// currency_converter  $ node script.js createConversionFromInputs 800
// { convert_to_currency: 'EUR', input_amount: '800' }
// Connected to MongoDB


async function createConversionFromInputs(inputs) {
    const convert_to = {
        convert_to_currency: 'EUR'
    }

    const object2 = Object.assign(convert_to, inputs);

    console.log(object2);

    try {
        await getCurrencyInfo('EUR');
    }
    catch(exception) {
        console.log(exception.message);
    }
}

module.exports = { addConversion, createConversionFromInputs };