const fs = require("fs"),
      { toCompanyInfo } = require("../../logic/reports.js"),
      settings = require("./settings.js");

function StaticReportsParams() {
    const params = {},
          paramsIndex = settings.reports.reduce((index, r) => ({ ...index, [r.id]: r.path }), {});

    function loadParams(id) {
        if ( ! paramsIndex[id] ) {
            return null;
        }
        return JSON.parse(fs.readFileSync(`${ __dirname }/${ paramsIndex[id] }/params.json`));
    }

    function reportFields({ fields }) {
        return fields.map(f => ({ name: f.columnName, dataTypeName: f.dataType }));
    }

    function byId(id, companyInfo) {
        if ( paramsIndex[id] && ! params[id] ) {
            params[id] = {
                ...loadParams(id),
                companyInfo: toCompanyInfo(companyInfo),
            };
        }
        return params[id];
    }

    function render(reportId, companyInfo) {
        return(byId(reportId, companyInfo));
    }

    return {
        render,
        reportFields,
    };
}

module.exports = StaticReportsParams;
