const {
    somePipe,
    someNumPipe,
    doubleQuoted,
    singleQuotedStr,
    dateFromWeekNumber,
} = require("../../logic/misc.js");

describe("somePipe", () => {
    const fnA = jest.fn(),
          fnNull = jest.fn(),
          fnUndefined = jest.fn();

    fnA.mockReturnValue("A");
    fnNull.mockReturnValue(null);
    fnUndefined.mockReturnValue(undefined);

    it("pipes results through all functions", () => {
        expect(somePipe(10, x => x * 2, x => x - 5)).toBe(15);
    });

    it("stops piping when the prior result is null or undefined and then returns null", () => {
        expect(somePipe(1, fnA, fnUndefined, fnNull)).toBe(null);
        expect(fnA).toHaveBeenCalled();
        expect(fnUndefined).toHaveBeenCalled();
        expect(fnNull).not.toHaveBeenCalled();
    });
});

describe("someNumPipe", () => {
    it("pipes results through all functions", () => {
        const fn0 = jest.fn(),
              fn1 = jest.fn(),
              fn2 = jest.fn();

        fn0.mockReturnValue(0);
        fn1.mockReturnValue(1);
        fn2.mockReturnValue(2);

        expect(someNumPipe(0, fn0, fn1, fn2)).toBe(2);
    });

    it("stops piping when the prior result is NaN, null or undefined and then returns null", () => {
        const fnA = jest.fn(),
              fn0 = jest.fn(),
              fn1 = jest.fn();

        fnA.mockReturnValue("A");
        fn0.mockReturnValue(0);
        fn1.mockReturnValue(1);

        expect(someNumPipe(1, fn0, fnA, fn1)).toBe(null);
        expect(fn0).toHaveBeenCalled();
        expect(fnA).toHaveBeenCalled();
        expect(fn1).not.toHaveBeenCalled();
    });
});

describe("singleQuoted", () => {
    it("quotes strings with single quotes", () => {
        expect(singleQuotedStr("abc")).toBe("'abc'");
        expect(singleQuotedStr("1'st")).toBe("'1''st'");
    });
});

describe("doubleQouted", () => {
    it("quotes strings with double quotes", () => {
        expect(doubleQuoted("abc")).toBe('"abc"');
    });
});

describe("dateFromWeekNumber", () => {
    it("returns the Sunday date for the selected week in the year", () => {
        expect(dateFromWeekNumber(2025, 1)).toStrictEqual(new Date(2024, 11, 29));
        expect(dateFromWeekNumber(2024, 1)).toStrictEqual(new Date(2023, 11, 31));
        expect(dateFromWeekNumber(2023, 1)).toStrictEqual(new Date(2023, 0, 1));
        expect(dateFromWeekNumber(2022, 1)).toStrictEqual(new Date(2021, 11, 26));
    });
});
