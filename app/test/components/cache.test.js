const { constantly } = require("../../logic/misc.js");

const Cache = require("../../components/cache.js"),
      cache = Cache();

describe("Cache refresh", () => {
    it("refreshes data and validates cache", () => {
        const refreshFn = jest.fn(),
              container = cache.Container(refreshFn);

        container.refresh();
        expect(refreshFn).toHaveBeenCalledTimes(1);
        container.refresh();
        expect(refreshFn).toHaveBeenCalledTimes(1);

    });
});

describe("Cache invalidate", () => {
    it("invalidates cache", () => {
        const refreshFn = jest.fn(),
            container = cache.Container(refreshFn);

        container.refresh();
        expect(refreshFn).toHaveBeenCalledTimes(1);
        container.invalidate();
        container.refresh();
        expect(refreshFn).toHaveBeenCalledTimes(2);

    });
});

describe("Cache get", () => {
    it("gets a value by key from cache", () => {
        const refreshFn = constantly({ a: 1, b: 2, c: 3 }),
            container = cache.Container(refreshFn);
        container.refresh();
        expect(container.get("a")).toBe(1);
    });

    it("refreshes cache if invalid before getting the value", () => {
        const refreshFn = jest.fn(),
              container = cache.Container(refreshFn);
        refreshFn.mockReturnValue({ a: 1, b: 2, c: 3 });
        expect(container.get("b")).toBe(2);
        expect(refreshFn).toHaveBeenCalledTimes(1);
        expect(container.get("a")).toBe(1);
        expect(refreshFn).toHaveBeenCalledTimes(1);
    });
});
