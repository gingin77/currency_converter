const columnify = require("columnify");
const {
  valueFormatter,
  listTimeFormat
} = require("./console_shared.js");

function outputToConsole(recordsCollected) {
  let recordsforColumnify = recordsCollected.reduce(
    (acc, val) => acc.concat(val), []
  );

  console.log(columnify(recordsforColumnify, {
      config: {
        base_currency: { minWidth: 30 },
        b_amount: { align: "right", minWidth: 12 },
        ct_amount: { align: "right", minWidth: 12 },
        convert_to_currency: { minWidth: 30 },
        b_rate: { align: "right", minWidth: 10 },
        ct_rate: { align: "right", minWidth: 10 },
        rate_Pub_Time: { align: "right", minWidth: 30 },
        conversion_Time: { align: "right", minWidth: 30 }
      }
    }));
}

function reorganizeContent(records) {
  let recordsCollected = [];

  records.forEach(r => {
    let input = {
      base_currency: r.name,
      input_amount: valueFormatter(r.amount),
      base_rate: r.rate.toFixed(4),
      rate_Pub_Time: listTimeFormat(r.ratePublicationTime),
      conversion_Time: listTimeFormat(r.conversionTime)
    };

    let outputs = r.convertTo.map(c => {
      return {
        name: c.name,
        amount: valueFormatter(c.amount),
        rate: c.rate.toFixed(4)
      }
    });

    let singleObjectForColuminfy = outputs.map(c => {
      return {
        base_currency: input.base_currency,
        b_amount: input.input_amount,
        ct_amount: c.amount,
        convert_to_currency: c.name,
        b_rate: input.base_rate,
        ct_rate: c.rate,
        rate_Pub_Time: input.rate_Pub_Time,
        conversion_Time: input.conversion_Time
      }
    });
    recordsCollected.push(Array.from(singleObjectForColuminfy));
  });
  return recordsCollected;
}

function prettyPrintRecordsInList(records) {
  let recordsCollected = reorganizeContent(records);
  outputToConsole(recordsCollected);
}

module.exports = { prettyPrintRecordsInList };
