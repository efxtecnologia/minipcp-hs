function Routes({ httpIn, config }) {
    return {
        static: [
            { path: "/", filePath: `${ config.staticRoot }/webmrp.io` },
            { path: "/app", filePath: `${ config.staticRoot }/frontend/dist` },
        ],
        api: [
            { path: "/version", method: "get", name: "version", handler: httpIn.version },
            { path: "/auth/sign-in", method: "post", name: "signIn", handler: httpIn.signIn },
            { path: "/auth/refresh", method: "post", name: "authRefresh", handler: httpIn.refresh },

            { path: "/api/v1/reports", method: "get", name: "reports", handler: httpIn.reports },
            { path: "/api/v1/reports/:id/params", method: "get", name: "reportParams", handler: httpIn.reportParams },
            { path: "/api/v1/reports/:id/data", method: "get", name: "reportData", handler: httpIn.reportData },

            { path: "/api/v1/features", method: "get", name: "features", handler: httpIn.features },
            { path: "/api/v1/features/:id", method: "get", name: "feature", handler: httpIn.feature },

            { path: "/api/v1/actions/:id", method: "get", name: "actionGet", handler: httpIn.action },
            { path: "/api/v1/actions/:id/:param", method: "get", name: "actionGet", handler: httpIn.action },
            { path: "/api/v1/actions/:id", method: "put", name: "actionPut", handler: httpIn.action },
            { path: "/api/v1/actions/:id", method: "post", name: "actionPost", handler: httpIn.action },
            { path: "/api/v1/actions/:id", method: "delete", name: "actionDelete", handler: httpIn.action },
        ]
    };
}

module.exports = Routes;
