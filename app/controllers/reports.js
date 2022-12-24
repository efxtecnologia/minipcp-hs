const { toSQL, toOneReport, rawDlgParamsToDialogParams, expectedParams, replaceSQLParams, typeTranslation } = require("../logic/reports.js");

const reportsSQL = `
    select
        grupo as group, idrelat as id, titulo as title,
        case
            when grupo = 'PRODUTOS' then 1
            when grupo = 'LOTES' then 2
            when grupo = 'VENDAS' then 3
            when grupo = 'COMPRAS' then 4
            when grupo = 'PRODUCAO' then 5
            when grupo = 'FINANCEIRO' then 6
            when grupo = 'FATURAMENTO' then 7
            else 8
        end as group_order
    from
        ahr_relat
    order by
        group_order, idrelat`;

const oneReportSQL = `
    select
      idrelat, titulo, descricao, query as definition_body, cabecpagina, campostotal,
      camposgrupo, suprimirtotal, suprimirsubtotal, cabecgrupo
    from
      ahr_relat
    where
      idrelat = $1`;

const dialogParamsSQL = "select idrelat, linhadef from ahr_dlg_params where idrelat = $1",
      companyInfoSQL = "select opcao, coalesce(resultado, '') as resultado from view_parametros_licenciada";

function Reports({ db }) {

    const companyInfoPromise = db.query(companyInfoSQL);

    function reports({ db, staticReports }, _, callback) {
        db.query(reportsSQL, undefined, (err, res) => callback(
            { reports: staticReports.index.render(res.rows) }
        ));
    }

    async function reportParams({ db, staticReports }, req, callback) {
        const companyInfo = await companyInfoPromise,
              staticParams = staticReports.params.render(req.params.id, companyInfo);
        if ( staticParams ) {
            callback(staticParams);
        } else {
            const oneReport = await db.query(oneReportSQL, [req.params.id]),
                  dlgParams = await db.query(dialogParamsSQL, [req.params.id]),
                  fieldsInfo = await db.fieldsInfo(toSQL(oneReport.rows[0].definition_body));

            callback(toOneReport({ oneReport, dlgParams, companyInfo, fieldsInfo }));
        };
    }

    async function reportData({ db, staticReports }, req, callback) {
        const companyInfo = await companyInfoPromise,
              reportId = req.params.id,
              queryParams = req.query,
              staticReportData = await staticReports.data.byReportId(reportId, companyInfo, queryParams);
        if ( staticReportData ) {
            callback(staticReportData);
        } else {
            const oneReport = await db.query(oneReportSQL, [reportId]),
                  dlgParams = await db.query(dialogParamsSQL, [reportId]),
                  paramTypes = expectedParams(rawDlgParamsToDialogParams(dlgParams)),
                  baseSql = toSQL(oneReport.rows[0].definition_body),
                  sql = replaceSQLParams(baseSql, paramTypes, queryParams),
                  rawData = await db.query(sql),
                  fields = await db.fieldsWithTypes(rawData.fields);

            callback({ ...rawData, fields });
        }
    }

    return {
        reports,
        reportParams,
        reportData,
    };
}

module.exports = Reports;
