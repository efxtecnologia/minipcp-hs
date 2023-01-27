const { Pool } = require("pg");

function Db({ config }, dbName) {
    const pool = new Pool(config.database(dbName));
    pool.on("error", (err, client) => {
        console.error("Unexpected error on idle client", err);
    });

    async function _query(sql, args) {
        const client = await pool.connect();
        try {
            const res = await client.query(sql, args);
            return res;
        } finally {
            client.release();
        }
    }

    async function query(sql, args, callback) {
        const res = await _query(sql, args);
        if (callback) {
            callback(null, res);
        }
        return res;
    }

    async function backendLogin() {
        await query(`select controle_de_usuarios_autenticar('SUPERADM')`);
    }

    function loginDbUser(userName) {
        // client.query(`select controle_de_usuarios_autenticar('${ userName }')`, (err, res) => res);
        // TODO: do something with user login name to keep connected sessions information
    }

    function mappedSqlArgs(sql) {
        return Array.from(new Set(sql.match(/\:[a-zA-Z_]+/g) || []));
    }

    async function colonArgsQuery(sql, args) {
        const sqlArgs = mappedSqlArgs(sql),
              argsList = new Array(sqlArgs.length).fill().map((_, i) => args[sqlArgs[i].replace(":", "")]),
              _sql = sqlArgs.reduce((s, arg, i) => s.replace(RegExp(arg, "g"), `$${ i+1 }`), sql);
        return await query(_sql, argsList);
    }

    function withTypeNames(fields, types) {
        const byOid = oid => types.filter(t => t.oid == oid)[0];
        return fields.map(f => ({ ...f, dataTypeName: byOid(f.dataTypeID).typname }));
    }

    async function fieldsWithTypes(fields) {
        const types = fields.map(f => f.dataTypeID).join(", "),
              sql = `select typname, oid from pg_type where oid in(${ types })`;
        const res = await query(sql);
        return withTypeNames(fields, res.rows);
    }

    function fieldsInfo(sql) {
        const dummyArgs = mappedSqlArgs(sql).reduce((args, arg, name) => ({ ...args, [name]: arg }), {});
        return colonArgsQuery(sql, dummyArgs).then(res => fieldsWithTypes(res.fields));
    }

    backendLogin();
    return {
        query,
        loginDbUser,
        colonArgsQuery,
        fieldsInfo,
        fieldsWithTypes,
    };
}

module.exports = Db;
