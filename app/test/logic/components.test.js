const {
    depResolved,
    depsResolved,
    withResolvedDeps,
} = require("../../logic/components.js");

describe("depResolved", () => {
    it("returns true or false if dependency is satisfied or not in components object", () => {
        expect(depResolved({}, "x")).toBe(false);
        expect(depResolved({ x: true }, "x")).toBe(true);
        expect(depResolved({ x: true }, "y")).toBe(false);
    });
});

describe("depsResolved", () => {
    it("it checks if all dependencies are satisfied in the components object", () => {
        expect(depsResolved({}, { name: "B", constructor: x => x, deps: [] })).toBe(true);
        expect(depsResolved({}, { name: "B", constructor: x => x, deps: ["A", "C"] })).toBe(false);
        expect(depsResolved({ C: true }, { name: "B", constructor: x => x, deps: ["A", "C"] })).toBe(false);
        expect(depsResolved({ A: true, C: true }, { name: "B", constructor: x => x, deps: [] }))
            .toBe(true);
        expect(depsResolved({ A: true, C: true }, { name: "B", constructor: x => x, deps: ["A", "C"] }))
            .toBe(true);
    });
});

describe("withResolvedDeps", () => {
    const constructor = x => x;
    const definitions = [
        { name: "A", constructor, deps: [] },
        { name: "B", constructor, deps: ["C"] },
        { name: "C", constructor, deps: [] },
    ];

    it("returns a list of component definitions with pending dependecies", () => {
        expect(withResolvedDeps({}, definitions)).toEqual([
            { name: "A", constructor, deps: [] },
            { name: "C", constructor, deps: [] },
        ]);
        expect(withResolvedDeps({ C: true }, definitions)).toEqual([
            { name: "A", constructor, deps: [] },
            { name: "B", constructor, deps: ["C"] },
            { name: "C", constructor, deps: [] },
        ]);
    });
});
