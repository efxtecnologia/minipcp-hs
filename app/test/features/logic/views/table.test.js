const { tr, tHead, tBody, table } = require("../../../../features/logic/views/table.js");

describe("tr", () => {
    it("returns a table row of the specified type of cell", () => {
        expect(tr("th", ["a", "b", "cd"])).toEqual(["tr", ["th", "a"], ["th", "b"], ["th", "cd"]]);
        expect(tr("td", ["a", "b", "Abcd"])).toEqual(["tr", ["td", "a"], ["td", "b"], ["td", "Abcd"]]);
    });
});

describe("tHead", () => {
    it("returns a table header", () => {
        expect(tHead(["a", "b", "cd"])).toEqual(["thead", ["tr", ["th", "a"], ["th", "b"], ["th", "cd"]]]);
    });
});

describe("tBody", () => {
    it("returns a tBody with a tr for each row", () => {
        expect(tBody([["1", "2", "3"]], undefined))
            .toEqual(["tbody",
                      ["tr",
                       ["td", "1"], ["td", "2"], ["td", "3"]]]);
    });

    it("sets an id to tBody if specified", () => {
        expect(tBody([["1"]], "my-own-id"))
            .toEqual(["tbody", { id: "my-own-id" },
                      ["tr", ["td", "1"]]]);
    });
});

describe("table", () => {
    const headers = ["col A", "col B", "col C"],
          rows = [
              ["1", "2", "3"],
              ["x", "y", "z"],
          ],
          classes = ["uk-table", "uk-table-hover"];

    it("returns a table element", () => {
        expect(table(headers, rows, { classes, tBodyId: "own-tbody-id" }))
            .toEqual(
                ["table", { class: ["uk-table", "uk-table-hover"] },
                 ["thead",
                  ["tr",
                   ["th", "col A"], ["th", "col B"], ["th", "col C"]]],
                 ["tbody", { id: "own-tbody-id" },
                  ["tr",
                   ["td", "1"], ["td", "2"], ["td", "3"]],
                  ["tr",
                   ["td", "x"], ["td", "y"], ["td", "z"]]
                 ]]
            );
    });
});
