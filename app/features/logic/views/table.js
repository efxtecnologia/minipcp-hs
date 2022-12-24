function tr(cellTag, values) {
    return values.reduce((tr, h) => tr.concat([[cellTag, h]]), ["tr"]);
}

function tHead(headers) {
    return ["thead", tr("th", headers)];
}

function tBodyRows(rows) {
    return rows.map(row => tr("td", row));
}

function tBody(rows, id) {
    return (id ? ["tbody", { id }] : ["tbody"])
        .concat(tBodyRows(rows));
};

function table(headers, rows, { classes, tBodyId }) {
    return ["table", { class: classes },
            tHead(headers),
            tBody(rows, tBodyId)];
}

module.exports = {
    tr,
    tHead,
    tBody,
    tBodyRows,
    table,
};
