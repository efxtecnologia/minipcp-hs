const { constantly, assocIf } = require("../../../../logic/misc.js"),
      select = require("./select.js");

const fieldTypes = {
    text: "text",
    password: "password",
    int: "int",
    float: "float",
    date: "date",
    file: "file",
    checkBox: "checkBox",
    radioGroup: "radioGroup",
    select: "select",
};

const radioGroupOptions = {
    values: [],
    captions: [],
    ids: [],
    selectedOption: 0,
};

const checkBoxOptionsSample = {
    checked: true, // | false
    valueChecked: "",
    valueUnchecked: "",
};

const numericInputOptions = {
    mask: "#,##0.00",
};

const selectOptions = {
    options: [
        { value: "value", caption: "Some caption" },
        { value: "otherValue", caption: "Other caption" },
    ]
};

const fieldSample = {
    id: "single-field-id",
    name: "some-name",
    caption: "Single field caption",
    type: fieldTypes.text,
    defaultValue: "x",
    options: {}, // depends on type
};

function baseAttrs(id, name) {
    return assocIf({ id, name, class: ["uk-input"]}, "name", name);
}

function textInput({ id, name, defaultValue }) {
    return ["input", assocIf({ ...baseAttrs(id, name), }, "value", defaultValue)];
}

function passwordInput({ id, name, defaultValue }) {
    return ["input", assocIf({ ...baseAttrs(id, name), type: "password" }, "value", defaultValue)];
}

function typeIsInt({ type }) {
    return type === "int";
}

function numericInput({ id, type, name, defaultValue }) {
    const maskMethod = type;
    return [
        "input",
        assocIf({
            ...baseAttrs(id, name),
            private: { init: { Mask: maskMethod } },
        }, "value", defaultValue),
    ];
}

function radioAttrs({ id, name, options }, index) {
    return Object.assign(
        {
            class: ["uk-radio"],
            type: "radio",
            name: name ?? id,
            id: options.ids[index],
            value: options.values[index],
        },
        options.selectedOption === index ? { checked: true } : {}
    );
}

function radioItem(field, caption, index) {
    return ["label", { class: ["uk-text-light"] },
            ["input", radioAttrs(field, index)],
            ["span", { class: ["uk-margin-small-left", "uk-margin-right"] }, caption]];
}

function radioItems(field) {
    return field.options.captions.map((caption, index) => radioItem(field, caption, index));
}

function radioGroup(field) {
    return ["div", { class: ["uk-form-controls"] },
            ...radioItems(field)];
}

function checkBoxOptions({ id, name, options }) {
    return Object.assign(
        {
            id,
            name,
            class: ["uk-checkbox"],
            type: "checkbox",
            dataValueChecked: options.valueChecked,
            dataValueUnchecked: options.valueUnchecked,
        },
        ( options.checked ? { checked: options.checked } : {} )
    );
}

function checkBox(field) {
    return ["div", { class: ["uk-form-controls"] },
            ["label",
             ["input", checkBoxOptions(field)],
             ["span", { class: ["uk-text-bold", "uk-margin-left"] }, field.caption]]];
}

function dateInput({ id, name }) {
    return ["div", { class: ["uk-inline"]},
            ["input", {
                id,
                name,
                class: ["uk-input"],
                type: "text",
                dataSubType: "date",
                style: { cursor: "pointer" },
                private: { init: { DatePicker: true } },
            }],
            ["span", { class: ["uk-form-icon", "uk-form-icon-flip"], ukIcon: "calendar" }]];
}

function fileUpload({ id, name, label, progressBarId, receiveUploadActionId }) {
    const labelParts = label.split("|");
    return ["div",
            ["div", { id, class: ["js-upload", "uk-placeholder", "uk-text-center"], private: { init: { Upload: true }, progressBarId, receiveUploadActionId, } },
            ["span", { ukIcon: "icon: cloud-upload" }],
            ["span", { class: ["uk-text-middle"] }, ` ${labelParts[0].trim()} `],
            ["div", { ukFormCustom: "uk-form-custom" },
                ["input", { name, type: "file", multiple: "multiple" }],
                ["span", { class: ["uk-link"] }, ` ${labelParts[1].trim()}`]],
            ],
            ["progress", { id: progressBarId, class: ["uk-progress"], value: "0", max: "100", hidden: "hidden" }]];
}

const inputs = {
    [fieldTypes.text]: textInput,
    [fieldTypes.password]: passwordInput,
    [fieldTypes.int]: numericInput,
    [fieldTypes.float]: numericInput,
    [fieldTypes.date]: dateInput,
    [fieldTypes.radioGroup]: radioGroup,
    [fieldTypes.checkBox]: checkBox,
    [fieldTypes.select]: select,
    [fieldTypes.file]: fileUpload,
};

function formInput(field) {
    return inputs[field.type](field);
}

function showLabel({ type }) {
    return type !== "ptCheckBox";
}

function formField(field, classes = ["uk-margin"], attrs = {}) {
    return ["div", { class: classes,  ...attrs },
            (showLabel(field) ?
             ["label", { class: ["uk-text-bold", "uk-form-label"], for: field.id }, field.caption] :
             ["span"]),
            ["div", { class: ["uk-form-controls"] },
             formInput(field)]];
}

module.exports = {
    fieldTypes,
    formField,
};
