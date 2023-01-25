function Controllers() {
    return {
        Reports: require("../controllers/reports.js"),
        FeaturesIndex: require("../features/index.js"),
    };
}

module.exports = Controllers;
