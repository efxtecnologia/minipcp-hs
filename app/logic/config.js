const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(),
      _ = require("lodash");

function upperSnakeToCamel(s) {
    const parts = s.split("_");
    return parts[0].toLowerCase() + parts.slice(1).map(capitalizeFirstLetter).join("");
}

function envToPath(s) {
    const parts = s.split("__");
    return parts.map(upperSnakeToCamel);
}

function pathToObject(path, value) {
    const newValue = { [path.slice(-1)]: value };
    if ( path.length > 1 ) {
        return pathToObject(path.slice(0, -1), newValue);
    }
    return newValue;
}

function cfgEnvVarNames(env, prefix, separator) {
    return _.keys(env).filter(s => s.startsWith(prefix + separator));
}

function varsToObjects(prefix, names, env) {
    return names
        .map(name => name.replace(prefix, ""))
        .map(name => pathToObject(envToPath(name), env[prefix+name]));
}

function mergeConfig(prefix, prefixSeparator, baseConfig, env) {
    const envConfigs = varsToObjects(
        prefix+prefixSeparator,
        cfgEnvVarNames(env, prefix, prefixSeparator),
        env,
    );
    return envConfigs.reduce((base, cfg) => _.merge(base, cfg), baseConfig);
}

module.exports = { upperSnakeToCamel, envToPath, pathToObject, cfgEnvVarNames, varsToObjects, mergeConfig };
