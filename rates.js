const request             = require('request');
const dotenv              = require('dotenv').config();
const currencyToSymbolMap = require('currency-symbol-map/map');
const moment              = require('moment');

const key        = process.env.OPEN_EXCHANGE_KEY
const oe_root    = 'https://openexchangerates.org/api/'
const oe_options = { 'latest': 'latest.json?' }

const latest_url     = `${oe_root}${oe_options.latest}app_id=${key}`
const currencies_url = 'https://openexchangerates.org/api/currencies.json'

async function getCurrencyInfo(currency) {
    console.log("Getting exchange rate....")
    const symbol = currencyToSymbolMap[currency];

    try {
        const timeRetrieved = Date.now();
        const ratesResponse = await getExchangeRate();
        const currencyName  = await getCurrencyName(currency);
        
        const { rates, timestamp } = ratesResponse;

        const rate = rates[currency];
        
        console.log(`
The current rate for the ${currencyName} is ${symbol}${rate.toFixed(2)} compared to one US dollar, $1.00.
Time published by Open Exchange Rates: ${moment.unix(timestamp).format('dddd, MMMM Do, YYYY, h:mm a')}
Time retrieved with MyCurrencyConverter: ${ moment(timeRetrieved).format('dddd, MMMM Do, YYYY, h:mm a')}`);
    }
    catch(err) {
        console.log('Error', err.message);
    }
}

function getExchangeRate() {
    return new Promise((resolve, reject) => {
        request(latest_url, (error, res, body) => {
            if (!error && res.statusCode == 200) {
                let response = JSON.parse(body);
                resolve(response);
            }
        });
    });
}

function getCurrencyName(currency) {
    return new Promise((resolve, reject) => {
        request(currencies_url, (error,res,body) => {
            if (!error && res.statusCode == 200) {
                currencies = JSON.parse(body);
                resolve(currencies[currency]);
            }
        });
    });
}

module.exports = { getCurrencyInfo };