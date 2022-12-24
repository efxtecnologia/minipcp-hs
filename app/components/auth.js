const { authToken } = require("../logic/auth.js");

const noAuthUrls = [
    "/version",
    "/auth/sign-in",
];

function authenticationNeeded(url) {
    return ! noAuthUrls.reduce((needed, u) => needed || url?.startsWith(u), false);
}

function Auth({ crypto, jwt, db, config }) {
    const { jwtKey, jwtExpirySeconds } = config.auth;

    function md5Password(password) {
        return crypto.createHash("md5").update(password).digest("hex");
    }

    function withScopes(user) {
        if ( ! user.logon ) {
            return user;
        }
        return Object.assign({}, user, { scopes: (user.scopes || "").split(",").map(s => s.trim()) });
    }

    async function queryUser(userName, password) {
        const user = await db.query(
            "select logon, scopes from acs_usuarios where logon = $1 and senhamd5 = $2",
            [userName?.toUpperCase(), md5Password(password)]
        );
        return withScopes(user.rows[0] || {});
    }

    async function setPassword(userName, password) {
        const sql = "update acs_usuarios set senhamd5 = $1 where logon = $2";
        await db.query(sql, [md5Password(password), userName?.toUpperCase()]);
    }

    async function validUser(userName, password) {
        if ( ! userName || ! password ) {
            return false;
        }
        return await queryUser(userName, password);
    }

    async function signIn({ userName, password, fingerPrint }) {
        const user = await validUser(userName, password);
        if ( user.logon ) {
            await db.loginDbUser(user);
        }
        return authToken({ jwt, jwtKey, jwtExpirySeconds, fingerPrint, username: user.logon, scopes: user.scopes });
    }

    function refresh(auth) {
        const { username, scopes, fingerPrint } = auth;
        return authToken({ jwt, jwtKey, jwtExpirySeconds, fingerPrint, username, scopes });
    }

    function middleware(req, res, next) {
        if ( ! authenticationNeeded(req?.originalUrl) ) {
            return next();
        }
        const tokenParts = req?.token?.split("::") || [],
              token = tokenParts[0],
              fingerPrint = tokenParts[1] || "";

        try {
            req.auth = { ...jwt.verify(token, jwtKey + fingerPrint), fingerPrint };
        } catch(e) {
		        if (e instanceof jwt.JsonWebTokenError || e instanceof jwt.TokenExpiredError) {
			          return res.status(401).end();
		        }
            return res.status(400).end();
        }
        return next();
    }

    return {
        validUser,
        setPassword,
        signIn,
        refresh,
        middleware,
    };
}

module.exports = Auth;
