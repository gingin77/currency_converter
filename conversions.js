const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/currency_converter')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

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
    rate: { type: Number, required: true },
    input_amount: { type: Number, required: true },
    output_amout: { type: Number, required: true },
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

createConversion()