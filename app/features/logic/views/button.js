function withClasses(classes, moreClasses) {
    return (classes || []).concat(moreClasses);
}

function buttonsContainer(buttons) {
    return ["div", { class: ["uk-margin", "uk-align-right"]},
           ].concat(buttons);
}

function button(caption, classes, options, icon) {
    const props = {
        class: withClasses(["uk-button", "uk-button-large", "uk-button-default"], classes),
        ...(options || {}),
    };
    return icon ?
        ["button", props,
         ["span", { ukIcon: icon }],
         ["span", { class: ["uk-margin-small-left"] }, caption]] :
        ["button", props, caption];
}

module.exports = { button, buttonsContainer, withClasses };
