const { rawDlgParamsToDialogParams, expectedParams, castToParamType, castToExpectedParamType, replaceSQLParams } = require("../../logic/reports.js");
const rawDlgParams = {
    rows: [
        {
            idrelat: 'COMISSOES_1',
            linhadef: 'd_ini;d_fim:data_r:Pedidos no período de:DIA1;DMAX::'
        },
        {
            idrelat: 'COMISSOES_1',
            linhadef: 'vnd_cod:int:Código do vendedor (zero para todos):0::'
        },
        {
            idrelat: 'COMISSOES_1',
            linhadef: 'status_b:chkbox:Aprovados:S;N::'
        },
    ]
};
const internalDialogParams = [
            {
                type: 'ptDateRange',
                name: { from: 'd_ini', to: 'd_fim' },
                caption: 'Pedidos no período de',
                suggestion: { from: 'DIA1', to: 'DMAX' },
                width: 0,
                numberFormat: '',
                checkBoxOptions: {},
                radioGroupOptions: {}
            },
            {
                type: 'ptInt',
                name: { from: 'vnd_cod', to: '' },
                caption: 'Código do vendedor (zero para todos)',
                suggestion: { from: '0', to: '' },
                width: 0,
                numberFormat: '',
                checkBoxOptions: {},
                radioGroupOptions: {}
            },
            {
                type: 'ptCheckBox',
                name: { from: 'status_b', to: '' },
                caption: 'Aprovados',
                suggestion: { from: 'S', to: '' },
                width: 0,
                numberFormat: '',
                checkBoxOptions: { valueChecked: 'S', valueUnchecked: 'N', checked: false },
                radioGroupOptions: {}
            },
];

describe("rawDlgParamsToDialogParams", () => {
    it("converts raw params into a list of param objects", () => {
        expect(rawDlgParamsToDialogParams(rawDlgParams)).toEqual(internalDialogParams);
    });
});

describe("expectedParams", () => {
    it("converts dialog params into an object with params names and corresponding types", () => {
        expect(expectedParams(internalDialogParams)).toEqual({
            d_ini: 'ptDate',
            d_fim: 'ptDatePlus',
            vnd_cod: 'ptInt',
            status_b: 'ptCheckBox',
        });
    });
});

describe("castToParamType", () => {
    it("converts values accordingly to types to be used in SQL where clauses", () => {
        expect(castToParamType("ptInt", "1.239")).toBe("1239");
        expect(castToParamType("ptFloat", "1.234,567")).toBe("1234.567");
        expect(castToParamType("ptDate", "2022-01-31")).toBe("'2022-01-31'");
        expect(castToParamType("ptDatePlus", "2022-01-31")).toBe("'2022-02-01'");
        expect(castToParamType("ptText", "abcde")).toBe("'abcde'");
        expect(castToParamType("ptRadioGroup", "N")).toBe("'N'");
        expect(castToParamType("ptCheckBox", "A")).toBe("'A'");
    });

    it("returns 'null' if the value is empty or invalid", () => {
        expect(castToParamType("ptInt", "")).toBe("null");
        expect(castToParamType("ptFloat", "")).toBe("null");
        expect(castToParamType("ptDate", "")).toBe("null");
        expect(castToParamType("ptText", "")).toBe("null");
        expect(castToParamType("ptRadioGroup", "")).toBe("null");
        expect(castToParamType("ptCheckBox", "")).toBe("null");
    });
});

describe("castToExpectedParamType", () => {
    const paramTypes = {
        d_ini: 'ptDate',
        d_fim: 'ptDatePlus',
        vnd_cod: 'ptInt',
        status_b: 'ptCheckBox',
    };

    it("casts values accorddingly to param types", () => {
        expect(castToExpectedParamType(paramTypes, "d_ini", "2022-02-22")).toBe("'2022-02-22'");
        expect(castToExpectedParamType(paramTypes, "d_fim", "2022-02-24")).toBe("'2022-02-25'");
        expect(castToExpectedParamType(paramTypes, "d_ini", "")).toBe("null");
        expect(castToExpectedParamType(paramTypes, "vnd_cod", "1.234")).toBe("1234");
        expect(castToExpectedParamType(paramTypes, "status_b", "A")).toBe("'A'");
    });
});

describe("replaceSQLParams", () => {
    const paramTypes = {
        i: "ptInt",
        s: "ptText",
        d0: "ptDate",
        d1: "ptDatePlus",
    };

    it("replaces params in SQL with correctly converted values", () => {
        expect(
            replaceSQLParams(
                "select * from test where i = :i and s = :s and d0 >= :d0 and d1 < :d1",
                paramTypes,
                { i: "1.234", s: "ABC", d0: "2022-02-15", d1: "2022-02-15" }
            )
        ).toBe(
            "select * from test where i = 1234 and s = 'ABC' and d0 >= '2022-02-15' and d1 < '2022-02-16'"
        );
    });
});
