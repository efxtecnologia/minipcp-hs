const jsonResponse = (res, content) => res.type("application/json").json(content),
      { toCSV } = require("../adapters/report-data.js");

function HttpIn(components) {
    const reportControllers = components.controllers.Reports(components),
          featureControllers = components.controllers.FeaturesIndex(components),
          { auth, config } = components;

    function authResponseHandler(res, token) {
        if ( ! token ) {
            return res.status(401).end();
        }
        res.header("auth", JSON.stringify(token));
        return res.json({});
    }

    async function authSignInHandler(req, res) {
        const token = await auth.signIn(req.body);
        return authResponseHandler(res, token);
    }

    function authRefreshHandler(req, res) {
        const token = auth.refresh(req.auth);
        return authResponseHandler(res, token);
    }

    function versionHandler(req, res) {
        return res.json({ version: config.version });
    }

    function genericHandler(controller) {
        return async (req, res, next) => {
            try {
                await controller(components, req, content => jsonResponse(res, content));
            } catch(error) {
                next(error);
            }
        };
    }

    async function reportDataHandler(req, res, next) {
        try {
            await reportControllers.reportData(components, req, rawData => res.type("text/csv").send(toCSV(rawData)));
        } catch(error) {
            next(error);
        }
    }

    return {
        root: (req, res) => {
            components.db.query("select * from produtos", undefined, (pgErr, pgRes) => {
                res.type("application/json").json({ produtos: pgRes.rows });
            });
        },

        version: versionHandler,
        signIn: authSignInHandler,
        refresh: authRefreshHandler,
        reports: genericHandler(reportControllers.reports),
        reportParams: genericHandler(reportControllers.reportParams),
        reportData: reportDataHandler,
        features: genericHandler(featureControllers.index),
        feature: genericHandler(featureControllers.feature),
        action: genericHandler(featureControllers.action),
    };
}

module.exports = HttpIn;
