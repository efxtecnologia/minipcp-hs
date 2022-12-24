function authToken({ jwt, jwtKey, jwtExpirySeconds, fingerPrint, username, scopes }) {
    if ( ! username ) {
        return false;
    }

    const token = jwt.sign(
        { username, scopes },
        jwtKey + (fingerPrint || ""),
        {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
        }
    );

    if ( ! token ) {
        return false;
    }

    return {
        username,
        token,
        expiresIn: jwtExpirySeconds,
    };

}

module.exports = { authToken };
