const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");

const { getAllConversionRecords } = require('./conversions');

async function generateCsvBackup(fileInfo) {
  const { fileName, filePath } = fileInfo;
  const filePathString = `${filePath}/${fileName}`;

  try {
    const conversions = await getAllConversionRecords();
    const data = conversions.map(r => r.toObject());
    const headers = Object.keys(data[0]);

    const jsonParser = new Json2csvParser({ headers });
    const csv = jsonParser.parse(data);

    fs.appendFile(filePathString, csv, err => {
      if (err) throw err;
      console.log(`File saved!\n
      You backup is stored as ${fileName} at ${__dirname }\n
      The full path is: ${__filename} `) ;
    });

  } catch (ex) {
    console.log(ex.message);
  }
}

module.exports = { generateCsvBackup }