const { allowed } = require("./logic/index.js"),
      allFeatures = require("./features.js");

function FeaturesIndex(components) {
    const features = allFeatures(components);

    const actions = features.reduce((actions, feature) => actions.concat(feature.actions || []), []);

    function notFound() {
        const err = new Error("Not found");
        err.status = 404;
        throw err;
    }

    function index(context, req, callback) {
        const allowedFeatures = features.reduce((fs, f) => allowed(req, f) ? fs.concat(f) : fs, []);
        callback({ features: allowedFeatures });
    }

    function feature(context, req, callback) {
        const f = features.filter(f => f.id === req.params.id)[0];
        if ( f ) {
            return f.controller(context, req, callback);
        }
        return notFound();
    }

    function action(context, req, callback) {
        const action = actions.filter(action => action.id === req.params.id && action.method === req.method)[0];
        console.log(req.params, req.method);
        if ( ! action?.handler ) {
            return notFound();
        }
        return action.handler(context, req, callback);
    }

    return {
        index,
        feature,
        action,
    };
}

module.exports = FeaturesIndex;
