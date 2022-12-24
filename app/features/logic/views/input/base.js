const _ = require("lodash");

const basicInputAttrs = (field, type) => {

    return Object.assign(
        {
            class: ["uk-input"],
            type: type,
            name: field.name,
            private: { field, initValueGetterSetter },
        },
        field.attrs ? field.attrs : {},
    );
};

const mergeAttrs = (base, local) => _.defaultsDeep(base, local),
      inputAttrs = (field, attrs = {}, type = "text") => mergeAttrs(basicInputAttrs(field, type), attrs);

module.exports = inputAttrs;
