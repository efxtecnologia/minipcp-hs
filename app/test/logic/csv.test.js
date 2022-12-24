const { fieldNames, csvTitles, fieldToCSVValue, dataRowToCSVRow } = require("../../logic/csv.js");

const rawData = {
    fields: [
        { name: "A", dataTypeName: "int4" },
        { name: "B", dataTypeName: "varchar" },
        { name: "C", dataTypeName: "float8" },
        { name: "D", dataTypeName: "date" },
    ],

    rows: [
        {},
    ],
};

describe("fieldNames", () => {
    it("gets a list of fields and returns a list of quoted names", () => {
        expect(fieldNames(rawData)).toEqual(['"A"', '"B"', '"C"', '"D"']);
    });
});

describe("fieldTitles", () => {
    it("transforms data fields into a semicolon separeted CSV title row", () => {
        expect(csvTitles(rawData)).toBe('"A";"B";"C";"D"');
    });
});

describe("fieldToCSVValue", () => {
    const fields = [
        { name: "A", dataTypeName: "int4" },
        { name: "B", dataTypeName: "varchar" },
        { name: "C", dataTypeName: "float8" },
        { name: "D", dataTypeName: "date" },
        { name: "E", dataTypeName: "time" },
        { name: "F", dataTypeName: "timestamp" },
    ];

    it("converts field value to CSV value depending on field data type", () => {
        expect(fieldToCSVValue(fields, "A", 1960)).toBe("1960");
        expect(fieldToCSVValue(fields, "A", 1234)).toBe("1234");
        expect(fieldToCSVValue(fields, "B", "Some Name")).toBe('"Some Name"');
        expect(fieldToCSVValue(fields, "C", 1234.56)).toBe("1234.56");
        expect(fieldToCSVValue(fields, "D", new Date("2021-08-17T03:00:00.000Z"))).toBe('"2021-08-17"');
        expect(fieldToCSVValue(fields, "E", "15:16:12.549496")).toBe('"15:16:12"');
        expect(fieldToCSVValue(fields, "F", new Date("2021-08-17T03:00:00.000Z"))).toBe('"2021-08-17T03:00:00.000"');
    });

    it("treats null values", () => {
        expect(fieldToCSVValue(fields, "A", null)).toBe("null");
        expect(fieldToCSVValue(fields, "B", null)).toBe("null");
        expect(fieldToCSVValue(fields, "C", null)).toBe("null");
        expect(fieldToCSVValue(fields, "D", null)).toBe("null");
        expect(fieldToCSVValue(fields, "E", null)).toBe("null");
        expect(fieldToCSVValue(fields, "F", null)).toBe("null");
    });
});

describe("dataRowToCSVRow", () => {
    const rows = [
        { A: 1234, B: "Some Name", C: 123.456, D: new Date("2021-08-17T03:00:00.000Z") },
        { A: 1960, B: "Another Name", C: 456.789, D: new Date("2021-08-18T03:00:00.000Z") },
    ],
          fields = [
              { name: "A", dataTypeName: "int4" },
              { name: "B", dataTypeName: "varchar" },
              { name: "C", dataTypeName: "float8" },
              { name: "D", dataTypeName: "date" },
          ];
    it("transforns a raw data object into a CSV row", () => {
        expect(dataRowToCSVRow(fields, rows[0])).toBe('1234;"Some Name";123.456;"2021-08-17"');
        expect(dataRowToCSVRow(fields, rows[1])).toBe('1960;"Another Name";456.789;"2021-08-18"');
    });
});
