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
    message: "The ISO currency code should contain only alphabet characters"
  })
];

const convertToSchema = mongoose.Schema({
  iso: {
    type: String,
    required: true,
    validate: isoValidator
  },
  name: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const conversionSchema = mongoose.Schema({
  iso: {
    type: String,
    required: true,
    validate: isoValidator
  },
  name: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  amount: {
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
  },
  convertTo: [convertToSchema]
});

const Conversion = mongoose.model("Conversion", conversionSchema);

module.exports = { Conversion: Conversion };