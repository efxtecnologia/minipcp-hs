const { withWidth, sixGrid } = require("../../../../features/logic/views/grid.js");

describe("withWidth", () => {
    it("Adds width class to any element", () => {
        expect(withWidth({ element: ["div", "Text"], width: 2 }))
            .toEqual(["div", { class: ["uk-width-1-3"] }, "Text"]);

        expect(withWidth({ element: ["div", { id: "123" }, "Text"], width: 3 }))
            .toEqual(["div", { id: "123", class: ["uk-width-1-2"] }, "Text"]);

        expect(withWidth({ element: ["div", { id: "123", class: ["xyz"] }, "Text"], width: 3 }))
            .toEqual(["div", { id: "123", class: ["xyz", "uk-width-1-2"] }, "Text"]);
    });
});

describe("sixGrid", () => {
    it("Returns the list of components with width classes added, inside a grid container", () => {
        expect(sixGrid([
            { element: ["div", "Some text"], width: 1 },
            { element: ["div", "Other text"], width: 3 },
            { element: ["div", ["span", "More text"], ["span", "Sibling element"]], width: 2 },
        ])).toEqual(
            ["div", { ukGrid: "uk-grid" },
             ["div", { class: ["uk-width-1-6"] }, "Some text"],
             ["div", { class: ["uk-width-1-2"] }, "Other text"],
             ["div", { class: ["uk-width-1-3"] }, ["span", "More text"], ["span", "Sibling element"]]]
        );
    });
});
