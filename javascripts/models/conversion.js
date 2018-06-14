const mongoose = require('mongoose');
const validate = require('mongoose-validator');

var isoValidator = [
  validate({
    validator: "isLength",
    arguments: [3],
    message: "The ISO currency code should be 3 letters long."
  }),
  validate({
    validator: "isAlpha",
    passIfEmpty: true,
    message: "Name should contain alphabet characters"
  })
];

const conversionSchema = mongoose.Schema({
  baseISO: {
    type: String,
    required: true,
    validate: isoValidator
  },
  convertToISO: {
    type: String,
    required: true,
    validate: isoValidator
  },
  baseCurrencyName: {
    type: String,
    required: true
  },
  convertToCurrencyName: {
    type: String,
    required: true
  },
  baseRate: {
    type: Number,
    required: true
  },
  convertToRate: {
    type: Number,
    required: true
  },
  inputAmount: {
    type: Number,
    required: true
  },
  outputAmount: {
    type: Number,
    required: true
  },
  ratePublicationTime: {
    type: Date,
    required: true
  },
  conversionTime: {
    type: Date,
    default: Date.now(),
    required: true
  }
});

const Conversion = mongoose.model("Conversion", conversionSchema);

module.exports = { Conversion: Conversion };