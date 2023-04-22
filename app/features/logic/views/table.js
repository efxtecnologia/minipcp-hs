const _ = require("lodash");

function tr(cellTag, values) {
    return values.reduce((tr, h) => tr.concat([[cellTag, h]]), ["tr"]);
}

function tHead(headers) {
    return ["thead", tr("th", headers)];
}

function tBodyRows(rows, rowTransformer = _.identity) {
    return rows.map(row => tr("td", rowTransformer(row)));
}

function tBody(rows, id, rowTransformer = _.identity) {
    return (id ? ["tbody", { id }] : ["tbody"])
        .concat(tBodyRows(rows, rowTransformer));
};

function table(headers, rows, { classes, tBodyId }, rowTransformer = _.identity) {
    return ["table", { class: classes },
            tHead(headers),
            tBody(rows, tBodyId, rowTransformer)];
}

module.exports = {
    tr,
    tHead,
    tBody,
    tBodyRows,
    table,
};
