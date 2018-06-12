# curry_conv

A  Node.js command-line interface app for converting currencies.

To run this tool, you must obtain a key from [Open Exchange Rates](https://openexchangerates.org/). This is easy and doesn't require that you give credit card info. 

## System Requirements
1. [Node.JS](https://nodejs.org/en/): Node can be installed in multiple ways.
2. [MongoDB](https://www.mongodb.com/)
3. [git](https://git-scm.com/)

## Dependencies
For version details, see the package.json file.

## Installation Steps
TODO
1. Sign up for a [free account at openexchangerates.org](https://openexchangerates.org/signup/free).

## Options
TODO

## Troubleshooting
If you see `null` after `Getting exchange rates....` as shown in the example below, you are not connecting with the Open Exchange Rates API and likely need to add your key to the .env file.

```shell
 currency_converter  $ curry convert
? Choose a base currency type to convert from: United States Dollar
? Choose a currency type to convert to: Brazilian Real
? How much do you want to convert? 78900

Getting exchange rates...
null
```
