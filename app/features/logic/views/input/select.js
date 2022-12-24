function attrs(field) {
    return {
        id: field.id,
        name: field.name,
        class: ["uk-select"],
    };
};

function selectEmptyOption() {
    return ["option", { value: "" }, " -- selecione --"];
}

function selectOption({ value, caption }, defaultValue) {
    return ["option", { value, ...( value === defaultValue ? { selected: "selected" } : {} ) }, caption];
}

function select(field) {
    const { options, defaultValue } = field;
    return ["select", attrs(field),
            selectEmptyOption(),
            ...options.options.map(option => selectOption(option, defaultValue))];
}

module.exports = select;
