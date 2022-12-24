const moment = require("moment"),
      { doubleQuoted, identity } = require("./misc.js"),
      { findField, typeTranslation } = require("./reports.js");

const fieldNames = rawData => rawData.fields.map(f => doubleQuoted(f.name)),
      csvTitles = rawData => fieldNames(rawData).join(";"),
      timeStampAsString = d => (new Date(d)).toISOString().slice(0, -1),
      nullStr = s => s === null ? "null" : null,
      typeCastFunctions = {
          char: c => nullStr(c) || doubleQuoted(c),
          integer: i => String(i),
          float: f => String(f),
          datetime: d => nullStr(d) || doubleQuoted(timeStampAsString(d)),
          date: d => nullStr(d) || doubleQuoted(timeStampAsString(d).split("T")[0]),
          time: t => nullStr(t) || doubleQuoted(t.split(".")[0]),
          bool: identity,
      };

function fieldToCSVValue(fieldsInfo, fieldName, value) {
    return typeCastFunctions[typeTranslation(findField(fieldsInfo, fieldName))](value);
}

function dataRowToCSVRow(fieldsInfo, dataRow) {
    return fieldsInfo.map(i => fieldToCSVValue(fieldsInfo, i.name, dataRow[i.name] || null))
        .join(";");
}

module.exports = {
    fieldNames,
    csvTitles,
    fieldToCSVValue,
    dataRowToCSVRow,
};
