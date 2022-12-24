const { formField } = require("./input/input.js"),
      { sixGrid } = require("./grid.js");

const baseOptions = {
    class: ["uk-checkbox"],
    type: "checkbox",
};

function gridFields(fields) {
    return fields.map(f => ({ element: formField(f, []), width: f.width }));
}

function renderField(fieldOrFields) {
    return fieldOrFields.length === undefined ?
        formField(fieldOrFields) :
        sixGrid(gridFields(fieldOrFields));
}

function form(id, fields) {
    return ["form", { id, class: ["uk-form-stacked"] },
            ...fields.map(renderField)];
}

// TODO: refactor report dialogs to remove checkBox from here
function checkBox(context, options) {
    return ["div", { class: ["uk-form-controls"] },
            ["label",
             ["input", { ...baseOptions, ...( options || {} )}],
             ["span", { class: ["uk-text-bold", "uk-margin-left"] }, options.caption]]];
}

module.exports = {
    form,
    checkBox,
};
