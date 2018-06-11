require('dotenv').config()
const key     = process.env.OPEN_EXCHANGE_KEY
const request = require('request')

function getExchangeRates(base, convertTo) {
    const list = [base, convertTo].join(",")
    const url = `https://openexchangerates.org/api/latest.json?app_id=${key}&symbols=${list}`

    return new Promise((resolve, reject) => {
        console.log(`\nGetting exchange rates...`);
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body))
            } else {
                console.log(error);
            }
        });
    });
}

module.exports = { getExchangeRates }