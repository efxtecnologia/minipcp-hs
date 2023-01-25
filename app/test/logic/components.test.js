const {
    depResolved,
    depPending,
    depsResolved,
    depsPending,
    withPendingDeps,
} = require("../../logic/components.js");

describe("depResolved", () => {
    it("returns true or false if dependency is satisfied or not in components object", () => {
        expect(depResolved({}, "x")).toBe(false);
        expect(depResolved({ x: true }, "x")).toBe(true);
        expect(depResolved({ x: true }, "y")).toBe(false);
    });
});

describe("depPending", () => {
    it("checks if dependency is satisfied in components object", () => {
        expect(depPending({}, "x")).toBe(true);
        expect(depPending({ x: true }, "x")).toBe(false);
        expect(depPending({ x: true }, "y")).toBe(true);
    });
});

describe("depsPending", () => {
    it("it checks if there are unsatisfied dependencies in the components object", () => {
        expect(depsPending({}, { name: "B", constructor: x => x, deps: [] })).toBe(false);
        expect(depsPending({}, { name: "B", constructor: x => x, deps: ["A", "C"] })).toBe(true);
        expect(depsPending({ C: true }, { name: "B", constructor: x => x, deps: ["A", "C"] })).toBe(true);
        expect(depsPending({ A: true, C: true }, { name: "B", constructor: x => x, deps: [] }))
            .toBe(false);
        expect(depsPending({ A: true, C: true }, { name: "B", constructor: x => x, deps: ["A", "C"] }))
            .toBe(false);
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

describe("withPendingDeps", () => {
    const constructor = x => x;
    const definitions = [
        { name: "A", constructor, deps: [] },
        { name: "B", constructor, deps: ["C"] },
        { name: "C", constructor, deps: [] },
    ];

    it("returns a list of component definitions with pending dependecies", () => {
        expect(withPendingDeps({}, definitions)).toEqual([{ name: "B", constructor, deps: ["C"] }]);
        expect(withPendingDeps({ C: true }, definitions)).toEqual([]);
        expect(withPendingDeps({ A: true }, definitions)).toEqual([{ name: "B", constructor, deps: ["C"] }]);
    });
});
