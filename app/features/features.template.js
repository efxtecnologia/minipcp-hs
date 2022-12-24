const SessionControl = require("./base/session-control/index.js"),
    ChangePassword = require("./base/change-password/index.js");

function allFeatures(components) {
    return [
        SessionControl(components),
        ChangePassword(components),
    ];
}

module.exports = allFeatures;
