const _ = require("lodash"),
      settings = require("./settings.js"),
      StaticReportsParams = require("./params"),
      StaticReportsData = require("./data");

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

function StaticReports(components) {
    const index = StaticReportsIndex(),
          params = StaticReportsParams();

    return {
        index,
        params,
        data: StaticReportsData({ ...components, staticReportParams: params }),
    };
}

module.exports = StaticReports;
