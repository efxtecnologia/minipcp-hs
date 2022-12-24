const _ = require("lodash");

const WIDTH_MAP = {
    1: "uk-width-1-6",
    2: "uk-width-1-3",
    3: "uk-width-1-2",
    4: "uk-width-2-3",
    5: "uk-width-5-6",
    6: "uk-width-1-1",
    "x": "uk-width-expand",
};

function isAttrs(x) {
    return _.isObject(x) && ! _.isArray(x);
}

function hasAttrs(element) {
    return ( element.length > 2 && isAttrs(element[1]) );
}

function elementAttrs(element) {
    return hasAttrs(element) ? element[1] : {};
}

function elementContent(element) {
    return hasAttrs(element) ? element.slice(2) : element.slice(1);
}

function withClasses(attrs, classes) {
    return { ...attrs, class: (attrs.class ?? []).concat(classes) };
}

function withWidth({ element, width }) {
    return [element[0],
            withClasses(elementAttrs(element), WIDTH_MAP[width || "x"] || WIDTH_MAP["x"]),
            ...elementContent(element)];
}

function sixGrid(content) {
    return ["div", { ukGrid: "uk-grid" },
            ...(content.map(withWidth))];
}

module.exports = {
    withWidth,
    sixGrid,
};
