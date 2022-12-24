const settings = require("./settings.js");

const reporters = {
    "posicao-de-estoque": () => require("./posicao-de-estoque/data.js"),
};

function requireReporter(components, { path }) {
    const Reporter = reporters[path]();
    return Reporter(components);
}

function StaticReportsData(components) {
    const { db, staticReportsParams } = components,
          reporters = settings.reports.reduce((index, r) => ({
              ...index, [r.id]: requireReporter(components, r)
          }), {});

    async function byReportId(reportId, companyInfo, args) {
        return reporters[reportId] ? {
            rows: await reporters[reportId].data(args),
            fields: staticReportsParams.reportFields(staticReportsParams.render(reportId, companyInfo)),
        } : null;
    }

    return {
        byReportId,
    };
}

module.exports = StaticReportsData;
