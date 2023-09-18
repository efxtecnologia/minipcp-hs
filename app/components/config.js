const fs = require("fs"),
      _ = require("lodash"),
      { mergeConfig } = require("../logic/config.js");

const envPrefix = "SRVCFG",
      envPrefixSep = "___",
      version = "30904-01";

function Config(configPath = "./config/config.json") {
    const config = mergeConfig(
        envPrefix,
        envPrefixSep,
        JSON.parse(fs.readFileSync(configPath)),
        process.env
    );

    function database(dbName = "default") {
        return config.databases[dbName];
    }

    return {
        config,
        debug: config.debug === "S",
        dockerized: config.dockerized === "S",
        version,
        auth: config.auth,
        staticRoot: config.staticRoot,
        database,
        serverPort: config.serverPort || 3000,
    };
}

module.exports = Config;
