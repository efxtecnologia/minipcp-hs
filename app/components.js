const crypto = require("crypto"),
      express = require("express"),
      router = express.Router(),
      jwt = require("jsonwebtoken"),
      Auth = require("./components/auth.js"),
      Updater = require("./components/updater/index.js"),
      HttpIn = require("./components/http-in.js"),
      Routes = require("./components/routes.js"),
      Db = require("./components/db.js"),
      Config = require("./components/config.js"),
      Service = require("./components/service.js"),
      StaticReportsIndex = require("./components/static-reports/index.js"),
      StaticReportsParams = require("./components/static-reports/params.js"),
      StaticReportsData = require("./components/static-reports/data.js");

function Components(configPath) {
    const config = Config(configPath),
          controllers = {
              reports: require("./controllers/reports.js"),
              FeaturesIndex: require("./features/index.js"),
          },
          base = {
              config,
              crypto,
              express,
              router,
              jwt,
              controllers,
              app: express(),
              db: Db(config),
              Updater,
          },
          auth = Auth(base),
          baseStaticReports = {
              index: StaticReportsIndex(),
              params: StaticReportsParams(),
          },
          staticReports = {
              ...baseStaticReports,
              data: StaticReportsData({ ...base, staticReportsParams: baseStaticReports.params }),
          },
          httpIn = HttpIn({ ...base, auth, staticReports }),
          routes = Routes({ ...base, httpIn });

    return {
        ...base,
        auth,
        httpIn,
        routes,
        staticReports,
        service: Service({ ...base, auth, routes, staticReports }),
    };
}

module.exports = Components;
