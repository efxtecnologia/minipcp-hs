const { csvTitles, dataRowToCSVRow } = require("../logic/csv.js");

function toCSV(rawData) {
    const fields = rawData.fields,
          rowToCsv = row => dataRowToCSVRow(fields, row);
    return [
        csvTitles(rawData),
        ...(rawData.rows.map(rowToCsv))
    ].join("\n");
}

module.exports = {
    toCSV,
};
