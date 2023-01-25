const _ = require("lodash"),
      { constantly } = require("./logic/misc.js"),
      { moreComponents } = require("./logic/components.js"),
      Auth = require("./components/auth.js"),
      Updater = require("./components/updater/index.js"),
      HttpIn = require("./components/http-in.js"),
      Routes = require("./components/routes.js"),
      Controllers = require("./components/controllers.js"),
      Db = require("./components/db.js"),
      Config = require("./components/config.js"),
      Service = require("./components/service.js"),
      StaticReports = require("./components/static-reports/index.js");

const componentSettings = configPath => [
    { name: "crypto", constructor: constantly(require("crypto")), deps: [] },
    { name: "express", constructor: constantly(require("express")), deps: [] },
    { name: "router", constructor: require("express").Router, deps: [] },
    { name: "jwt", constructor: constantly(require("jsonwebtoken")), deps: [] },
    { name: "app", constructor: require("express"), deps: [] },
    { name: "config", constructor: _.partial(Config, configPath), deps: [] },
    { name: "controllers", constructor: Controllers, deps: [] },
    { name: "db", constructor: Db, deps: ["config"] },
    { name: "updater", constructor: Updater, deps: ["db"] },
    { name: "auth", constructor: Auth, deps: ["config", "crypto", "jwt", "db"] },
    { name: "staticReports", constructor: StaticReports, deps: ["config", "db"] },
    { name: "httpIn", constructor: HttpIn, deps: ["config", "auth", "controllers", "staticReports", "db"] },
    { name: "routes", constructor: Routes, deps: ["config", "httpIn"] },
    { name: "service", constructor: Service, deps: ["config", "app", "express", "router", "auth", "routes"] },
];

function System(configPath) {

    function init() {
        return moreComponents({}, componentSettings(configPath));
    }

    return {
        init,
    };
}

module.exports = System;
