const {
    upperSnakeToCamel,
    envToPath,
    pathToObject,
    cfgEnvVarNames,
    varsToObjects,
    mergeConfig,
} = require("../../logic/config.js");

describe("upperSnakeToCamel", () => {
    it("converts upper case snake to camel", () => {
        expect(upperSnakeToCamel("AUTH")).toBe("auth");
        expect(upperSnakeToCamel("JWT_KEY")).toBe("jwtKey");
        expect(upperSnakeToCamel("SOME_OTHER_KEY")).toBe("someOtherKey");
    });
});

describe("envToPath", () => {
    it("converts an env var with special notation into a path", () => {
        expect(envToPath("AUTH__JWT_EXPIRY_SECONDS")).toEqual(["auth", "jwtExpirySeconds"]);
        expect(envToPath("DATABASES__DEFAULT__HOST")).toEqual(["databases", "default", "host"]);
    });
});

describe("pathToObject", () => {
    it("converts a path into an object", () => {
        expect(pathToObject(["serverPort"], 3000))
            .toEqual({ serverPort: 3000 });
        expect(pathToObject(["auth", "jwtExpirySeconds"], 400))
            .toEqual({ auth: { jwtExpirySeconds: 400 }});
        expect(pathToObject(["databases", "default", "host"], "localhost"))
            .toEqual({ databases: { default: { host: "localhost" } }});
    });
});

describe("cfgEnvVarNames", () => {
    const env = {
        SRVCFG___VAR_A: 1,
        SOME_ENV_VAR: "x",
        SRVCFG___VAR_B: 2,
        OTHER_ENV_VAR: "y",
    };

    it("extracts names of config env vars from env object", () => {
        expect(cfgEnvVarNames(env, "SRVCFG", "___")).toEqual(["SRVCFG___VAR_A", "SRVCFG___VAR_B"]);
    });
});

describe("varsToObjects", () => {
    const env = {SRVCFG___SOME_CFG: 1, SRVCFG___SOME__DEEP_CFG: 2, SRVCFG___SOME__EVEN__DEEPER_CFG: 3,},
          names = ["SRVCFG___SOME_CFG", "SRVCFG___SOME__DEEP_CFG", "SRVCFG___SOME__EVEN__DEEPER_CFG"];

    it("returns objects for each env var", () => {
        expect(varsToObjects("SRVCFG___", names, env))
            .toEqual([
                { someCfg: 1 },
                { some: { deepCfg: 2 } },
                { some: { even: { deeperCfg: 3 } } },
            ]);
    });
});

describe("mergeConfig", () => {
    const baseConfig = {
        auth: {
            jwtExpSecs: 300,
            jwtKey: "YOUR-KEY",
        },
        databases: {
            default: {
                user: "postgres",
                host: "localhost",
                password: "YOUR-PWD",
            }
        }
    };

    const env = {
        SRVCFG___AUTH__JWT_EXP_SECS: 550,
        SRVCFG___AUTH__JWT_KEY: "my-real-key",
        SRVCFG___DATABASES__DEFAULT__PASSWORD: "1234567",
        SRVCFG___DATABASES__SYSTEM__USER: "sys_usr",
        SRVCFG___DATABASES__SYSTEM__HOST: "192.168.10.10",
        SRVCFG___DATABASES__SYSTEM__PASSWORD: "abcdxyz",
    };

    it("returns base configuration if there are no config env vars", () => {
        expect(mergeConfig("SRVCFG", "___", baseConfig, {}))
            .toEqual(baseConfig);
    });

    it("merges env configurations into base config", () => {
        expect(mergeConfig("SRVCFG", "___", baseConfig, env))
            .toEqual({
                auth: {
                    jwtExpSecs: 550,
                    jwtKey: "my-real-key",
                },
                databases: {
                    default: {
                        user: "postgres",
                        host: "localhost",
                        password: "1234567",
                    },
                    system: {
                        user: "sys_usr",
                        host: "192.168.10.10",
                        password: "abcdxyz",
                    }
                }
            });
    });
});
