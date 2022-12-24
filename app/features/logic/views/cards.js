function cardHeader(title, subtitle) {
    return ["div", { class: ["uk-card-header"] },
     ["h3", { class: ["uk-card-title", "uk-margin-remove-bottom"] }, title],
            ["p", { class: ["uk-text-meta", "uk-margin-remove-top"] }, subtitle]];
}

function cardBody(content, bodyOptions) {
    return ["div", { class: ["uk-card-body"], ...bodyOptions },
            content];
}

function cardFooter(content) {
    return ["div", { class: ["uk-card-footer"] },
            content];
}

function card({ title, subtitle , body, bodyOptions, footer, style }) {
    return ["div", { class: ["uk-card", "uk-card-hover", `uk-card-${ style || "default" }`] },
            cardHeader(title, subtitle),
            cardBody(body, bodyOptions || {}),
            cardFooter(footer)];
}

module.exports = card;
