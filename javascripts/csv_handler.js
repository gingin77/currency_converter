const Json2csvParser              = require("json2csv").Parser;
const fs                          = require("fs");
const { getAllConversionRecords } = require("./conversions");
const { success }                 = require("../views/csv");

function organizeContent(conversions) {
  const headers = Object.keys(conversions[0]);
  const jsonParser = new Json2csvParser({ headers })

  return(jsonParser.parse(conversions));
}

async function generateCsvBackup(fileInfo) {
  const { fileName, filePath } = fileInfo;
  const filePathString         = `${filePath}/${fileName}`;

  try {
    const conversions = await getAllConversionRecords();
    const csv         = organizeContent(conversions);

    fs.appendFile(filePathString, csv, err => {
      if (err) throw err;
      success(fileName, __dirname, __filename);
    });
  } catch (ex) {
    console.log(ex.message);
  }
}

module.exports = { generateCsvBackup }