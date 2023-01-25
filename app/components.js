const _ = require("lodash"),
      { constantly } = require("./logic/misc.js"),
      Auth = require("./components/auth.js"),
      Updater = require("./components/updater/index.js"),
      HttpIn = require("./components/http-in.js"),
      Routes = require("./components/routes.js"),
      Db = require("./components/db.js"),
      Config = require("./components/config.js"),
      Service = require("./components/service.js"),
      StaticReports = require("./components/static-reports/index.js");

function Controllers() {
    return {
        Reports: require("./controllers/reports.js"),
        FeaturesIndex: require("./features/index.js"),
    };
}

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
    { name: "routes", constructor: Routes, deps: ["httpIn"] },
    { name: "service", constructor: Service, deps: ["config", "app", "express", "router", "auth", "routes"] },
];

function System(configPath) {

    function depResolved(components, dep) {
        return components[dep] !== undefined;
    }

    const depPending = (components, dep) => ! depResolved(components, dep);

    function depsResolved(components, definition) {
        return definition => definition.deps.length === 0 ||
            definition.deps.reduce((ok, dep) => ok && depResolved(components, dep), true);
    }

    function depsPending(components, definition) {
        return definition => definition.deps.length > 0 &&
            definition.deps.reduce((pending, dep) => pending && depPending(components, dep), true);
    }

    function withResolvedDeps(components, definitions) {
        return definitions.filter(d => depsResolved(components, d));
    }

    function withPendingDeps(components, definitions) {
        return definitions.filter(d => depsPending(components, definitions));
    }

    function instantiate(components, { name, constructor }) {
        return { ...components, [name]: constructor(components) };
    }

    function moreComponents(components, componentDefinitions) {
        const pending = withPendingDeps(components, componentDefinitions);
        if (pending.length === 0) {
            return components;
        }
        const resolved = withResolvedDeps(components, pending).reduce(instantiate, components);
        if (resolved.length === 0) {
            return {
                error: "Some components dependencies could not be resolved",
                pending,
            };
        }
        return moreComponents(resolved.reduce(instantiate, components), componentDefinitions);
    }

    function init() {
        return moreComponents({}, componentSettings(configPath));
    }

    return {
        init,
    };
}

module.exports = System;
