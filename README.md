# curry_conv

A  Node.js command-line interface app for converting currencies.

To run this tool, you must obtain a key from [Open Exchange Rates](https://openexchangerates.org/). This is easy and doesn't require that you give credit card info.

Users are able to select both the input and output currency type. Conversion records are stored in a local Mongo database. Besides doing simple conversions, the user can retrieve the last conversion, up to 10 of the most recent conversions, and can choose a convert-to currency to filter on. Finally, the entire db can be exported to a .csv file. The user can choose and file name and file location, though the path defaults to the current directory so if the user doesn't want to enter a file path, they do not need to.

## System Requirements
1. [Node.JS](https://nodejs.org/en/)
  - I've been running v8.11.2 during development and manual testing
2. [MongoDB](https://www.mongodb.com/)
  - The database needs to be running. For more info on installing and setting up MongoDB, visit [Install MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/).
  - I've been running MongoDB shell version v3.6.5 during development and manual testing
3. [git](https://git-scm.com/) (needed if cloning this repo)

## Dependencies
For details, see the [package.json](https://github.com/gingin77/currency_converter/blob/master/package.json) file.
- Command line interface is supported by `commander` and `inquirer` modules
- API access depends on the `request` and `dotenv` modules
- Conversion record validation an storage depends on `mongoose` modules
- CSV export uses `json2csv` and Node's Core File System modules
- Multiple formatting modules were used to improve terminal output readability (`columnify`, `currency-symbol-map`, `moment`, and `pluralize`)

## Installation Steps
1. Clone the [currency converter repo](https://github.com/gingin77/currency_converter) and move into the currency_converter directory.
```shell
git clone https://github.com/gingin77/currency_converter.git
cd currency_converter
```
2. To access the executable `curry` command, you'll need to run a global npm install, which may or may not require you to use `sudo`:
```shell
currency_converter $ sudo npm i -g
```
3. You should now be able to run `curry --help` to see a list of [options](#options).
4. Using a browser, sign up for a [free account at openexchangerates.org](https://openexchangerates.org/signup/free) and obtain an API key.

5. Copy the .env.sample to a new .env file
```shell
cp .env.sample .env
```
6. Open your `.env` file and replace the dummy string with the API key obtained from Open Exchange Rates.

```shell
# .env
OPEN_EXCHANGE_KEY = 235233_your_actual_key_goes_here_53531513346713476
```

## Options
```shell
currency_converter $ curry --help

  Usage: curry [options] [command]

  Options:

    -V, --version   output the version number
    -h, --help      output usage information

  Commands:

    convert         Prompts user to submit currency types and a value to convert
    last-one        Retrieves a record of the last conversion
    last-ten        Retrieves up to 10 of the most recent conversions
    query-currency  Returns up to 10 records for a selected converted-to currency
    csv-export      Allows ALL historical conversions to be exported to a .csv file
```
## Example Outputs
### For `curry convert`
![alt text](https://github.com/gingin77/currency_converter/blob/master/example_outputs/curry_convert.png)

### For `curry last-one`
![alt text](https://github.com/gingin77/currency_converter/blob/master/example_outputs/curry_last-one.png)

### For `curry query-currency`
![alt text](https://github.com/gingin77/currency_converter/blob/master/example_outputs/curry_query-currency.png)

### For `curry csv-export: invalid input prompt`
![alt text](https://github.com/gingin77/currency_converter/blob/master/example_outputs/curry_csv-export_input-prompt.png)

### For `curry csv-export: success`
![alt text](https://github.com/gingin77/currency_converter/blob/master/example_outputs/curry_csv-export_done.png)

## Troubleshooting
- If you see `null` after `Getting exchange rates....` as shown in the example below, you are not connecting with the Open Exchange Rates API and likely need to add your key to the .env file.

```shell
 currency_converter  $ curry convert
? Choose a base currency type to convert from: United States Dollar
? Choose a currency type to convert to: Brazilian Real
? How much do you want to convert? 78900

Getting exchange rates...
null
```
- Error handling is incomplete, so use control+C to return to the terminal prompt when the script hangs.
