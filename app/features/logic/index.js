const { arrayIntersection } = require("../../logic/misc.js");

function hasScopes(req, feature, scopeType) {
    const requestedScopes = feature[scopeType];
    return ((requestedScopes || []).length === 0) ||
        (arrayIntersection([...requestedScopes, "dev"], req.auth.scopes).length > 0);
}

function allowed(req, feature) {
    return hasScopes(req, feature, "requiredScopes") &&
        hasScopes(req, feature, "allowedScopes");
}

module.exports = {
    allowed,
};
