const { trimLeft, maybeWithDelim, maybeWithSpace, assocIf, identity, somePipe, singleQuotedStr } = require("./misc.js"),
      definitionBodyToLines = definitionBody => definitionBody.replace(/\r/g, "").split("\n"),
      isSqlLine = s => ! s.startsWith("#"),
      looksLikeFieldDefLine = s => s.split(":").length >= 4,
      findField = (fieldsInfo, fieldName) => fieldsInfo.filter(i => i.name === fieldName)[0],
      dayjs = require("dayjs-with-plugins"),
      _ = require("lodash");

const dataTypesTranslations = [
    { name: "integer", options: ["int2", "int4", "int8", "_int2", "_int4", "_int8"] },
    { name: "float", options: ["numeric", "_numeric", "float4", "float8", "_float4", "_float8"] },
    { name: "datetime", options: ["timestamp", "imestamptz", "time_stamp", "atetime", "_timestamp", "timestamptz", "_time_stamp", "datetime"] },
    { name: "date", options: ["date", "_date"] },
    { name: "time", options: ["abstime", "reltime", "_abstime", "_reltime", "time", "_time", "timetz", "_timetz"] },
    { name: "bool", options: ["bool", "_bool"] },
];

function typeTranslation({ dataTypeName }) {
    return (dataTypesTranslations.filter(t => t.options.includes(dataTypeName))[0] ||
            { name: "char" }).name;
}

const ptDate = "ptDate",
      ptDatePlus = "ptDatePlus",
      ptDateRange = "ptDateRange",
      ptInt = "ptInt",
      ptIntRange = "ptIntRange",
      ptFloat = "ptFloat",
      ptFloatRange = "ptFloatRange",
      ptText = "ptText",
      ptRadioGroup = "ptRadioGroup",
      ptCheckBox = "ptCheckBox";

const dlgParamTypes = {
    data: ptDate,
    data_r: ptDateRange,
    int: ptInt,
    int_r: ptIntRange,
    float: ptFloat,
    float_r: ptFloatRange,
    char: ptText,
    radio: ptRadioGroup,
    chkbox: ptCheckBox,
};

function toSQLInt(s) {
    return somePipe(
        s,
        s => parseInt(s.replaceAll(".", "")),
        n => isNaN(n) ? "null" : String(n)
    );
}

function toSQLFloat(s) {
    return somePipe(
        s,
        s => parseFloat(s.replaceAll('.', '').replace(',', '.')),
        n => isNaN(n) ? "null" : String(n)
    );
}

function toSQLDate(s) {
    return dayjs(s).isValid() ? singleQuotedStr(dayjs(s).format("YYYY-MM-DD")) : "null";
}

function toSQLDatePlus(s) {
    return dayjs(s).isValid() ?
        singleQuotedStr(dayjs(s).add(1, "day").format("YYYY-MM-DD")) :
        "null";
}

function maybeSingleQuotedStr(s) {
    return s === "" ? "null" : singleQuotedStr(s);
}

const paramCastFunctions = {
    [ptInt]: toSQLInt,
    [ptFloat]: toSQLFloat,
    [ptDate]: toSQLDate,
    [ptDatePlus]: toSQLDatePlus,
    [ptText]: maybeSingleQuotedStr,
    [ptRadioGroup]: maybeSingleQuotedStr,
    [ptCheckBox]: maybeSingleQuotedStr,
};

function toField(fieldDefinitionLine, fieldsInfo) {
    const parts = fieldDefinitionLine.split(":"),
          field = findField(fieldsInfo, parts[0]);
    if ( ! field ) {
        return {};
    }
    return {
        columnName: parts[0],
        dataType: typeTranslation(findField(fieldsInfo, parts[0])),
        label: parts[0],
        displayFormat: parts[1],
        width: Number(parts[2]),
        visible: parts[3] !== "false",
    };
}

function paramRangeValue(paramType, value) {
    const pair = value.split(";");
    return {
        from: pair[0],
        to: [ptDateRange, ptIntRange, ptFloatRange].includes(paramType) ? pair[1] : "",
    };
}

function checkBoxOptions(paramType, value) {
    const pair = value.split(";");
    return {
        valueChecked: pair[0].replace("*", ""),
        valueUnchecked: pair[1].replace("*", ""),
        checked: pair[0].indexOf("*") >= 0,
    };
}

function radioGroupOptions(paramType, value) {
    const pair = value.split(";");
    return {
        captions: pair[0].split("|"),
        values: pair[1].split("|"),
        selectedOption: 0,
    };
}

function toDialogParam(paramDefinitionLine) {
    const parts = paramDefinitionLine.split(":"),
          type = dlgParamTypes[parts[1]];
    return {
        type,
        name: paramRangeValue(type, parts[0]),
        caption: parts[2],
        suggestion: paramRangeValue(type, parts[3]),
        width: Number(parts[4]),
        numberFormat: parts[5],
        checkBoxOptions: type === ptCheckBox ? checkBoxOptions(type, parts[3]) : {},
        radioGroupOptions: type === ptRadioGroup ? radioGroupOptions(type, parts[3]) : {},
    };
}

function toDialogParams(dlgParams) {
    return dlgParams.map(toDialogParam);
}

function toFields(definitionBody, fieldsInfo) {
    return definitionBodyToLines(definitionBody)
        .filter(line => ! isSqlLine(line) && looksLikeFieldDefLine(line))
        .map(line => toField(trimLeft(line, ["#", " "]), fieldsInfo));
}

function sqlQuery(definitionBody) {
    return definitionBodyToLines(definitionBody)
        .filter(isSqlLine)
        .join(" ");
}

function toGrouping(report) {
    return {
        columns: (report.camposgrupo || "").split(";"),
        headLines: (report.cabecgrupo || "").split(";"),
        aggregatorsVisible: report.suprimirsubtotal !== "S",
    };
}

function toAggregators(report) {
    return report.campostotal.split(";").map(c => ({ type: "agSum", columnName: c}));
}

function endereco(o) {
    return maybeWithSpace(o.END_LOGRADOURO_TIPO.trim()) +
        maybeWithDelim(o.END_LOGRADOURO_NOME, v => v.trim() !== "", ", ") +
        maybeWithDelim(o.END_NUMERO.trim(), o.END_COMPLEMENTO.trim() !== '', ' - ') +
        o.END_COMPLEMENTO.trim();
}

const toCompanyInfoObj = info => info.rows.reduce((o, i) => ({ ...o, [i.opcao]: i.resultado }), {});

function toCompanyInfo(companyInfo) {
    const o = toCompanyInfoObj(companyInfo);

    return {
        nome: o.NOME_FANTASIA,
        cep: o.END_CEP,
        cidade: o.END_CIDADE,
        uf: o.END_UF,
        endereco: endereco(o),
        bairro: o.END_BAIRRO,
        telefone: o.END_TELEFONE,
        email: o.END_EMAIL,
        url: o.END_SITE,
        logo: o.LOGO ? Number(o.LOGO) : null,
    };
}

function rawDlgParamsToDialogParams(dlgParams) {
    return toDialogParams(dlgParams.rows.map(p => p.linhadef));
}

function withParams(expected, paramRow) {
    const isRange = paramRow.type.includes("Range"),
          singleType = paramRow.type.replace("Range", ""),
          additionalType = paramRow.type === ptDateRange ? ptDatePlus : singleType;
    return assocIf(
        Object.assign({}, expected, { [paramRow.name.from]: singleType }),
        paramRow.name.to,
        isRange ? additionalType : null
    );
}

function expectedParams(dialogParams) {
    return dialogParams.reduce(withParams, {});
}

function castToParamType(paramType, value) {
    return paramCastFunctions[paramType](value);
}

function toOneReport({ oneReport, dlgParams, companyInfo, fieldsInfo }) {
    const report = oneReport.rows[0];

    return {
        id: report.idrelat,
        title: report.titulo,
        fields: toFields(report.definition_body, fieldsInfo),
        headLines: report.cabecpagina.split(";").filter(l => l.trim() !== ""),
        aggregators: toAggregators(report),
        aggregatorsVisible: report.suprimirtotal != "S",
        grouping: toGrouping(report),
        dialogParams: rawDlgParamsToDialogParams(dlgParams),
        companyInfo: toCompanyInfo(companyInfo),
    };
}

function toSQL(definitionBody) {
    return definitionBody.replace(/\r/g, "")
        .split("\n")
        .filter(line => ! line.trim().startsWith("#"))
        .join(" ");
}

function castToExpectedParamType(paramTypes, paramName, value) {
    return castToParamType(paramTypes[paramName], value);
}

function replaceSQLParams(sql, expectedParams, actualParams) {
    return _.reduce(
        actualParams,
        (_sql, value, param) => _sql.replaceAll(
            `:${ param }`, castToExpectedParamType(expectedParams, param, value)
        ),
        sql
    );
}

module.exports = {
    findField,
    toSQL,
    toCompanyInfo,
    toOneReport,
    rawDlgParamsToDialogParams,
    expectedParams,
    castToParamType,
    castToExpectedParamType,
    replaceSQLParams,
    typeTranslation,
};
