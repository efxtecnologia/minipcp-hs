const _ = require("lodash"),
      settings = require("./settings.js");

function StaticReportsIndex() {
    const staticIndex = settings.reports.map(r => ({
        group: r.group,
        group_order: r.groupOrder,
        id: r.id,
        title: r.title,
    }));

    function render(baseIndex) {
        return _.concat(baseIndex, staticIndex);
    }
    return {
        render,
    };
}

module.exports = StaticReportsIndex;
