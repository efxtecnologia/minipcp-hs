const { toCSV } = require("../../adapters/report-data.js");

const rawData = {
    fields: [
        { name: "A", dataTypeName: "int4" },
        { name: "B", dataTypeName: "varchar" },
        { name: "C", dataTypeName: "float8" },
        { name: "D", dataTypeName: "date" },
    ],
    rows: [
        { A: 1234, B: "Some Name", C: 123.456, D: new Date("2021-08-17T03:00:00.000Z") },
        { A: 1960, B: "Another Name", C: 456.789, D: new Date("2021-08-18T03:00:00.000Z") },
    ],
};

describe("toCSV", () => {
    it("transforms raw data into CSV data", () => {
        expect(toCSV(rawData)).toBe(
            '"A";"B";"C";"D"' + "\n" +
                '1234;"Some Name";123.456;"2021-08-17"' + "\n" +
                '1960;"Another Name";456.789;"2021-08-18"'
        );
    });
});
