const updates = [
    { version: "20221107-002", sql: require("./scripts/20221107.sql.js"), comment: "Add scopes to users table" },
    { version: "20221107-001", sql: require("./scripts/20221107-2.sql.js"), comment: "HS parameters initialization" },
    { version: "20221116-001", sql: require("./scripts/20221116-1.sql.js"), comment: "HS parameters initialization" },
];

function Updater({ db }) {
    function dataToSettings({ rows }) {
        return Array.from(rows).reduce((s, r) => Object.assign(s, { [r.opcao]: r.resultado }), {});
    }

    async function getSettings() {
        const data = await db.query(
            "select opcao, resultado from par_itens where parametro = 'HS'"
        );
        return dataToSettings(data);
    }

    async function upsertVersion(version) {
        await db.query(
            `insert into par_itens (parametro, opcao, resultado, sobrepor)
             values('HS', 'version', '${ version }', 'S') on conflict(parametro, opcao)
             do update set resultado = '${ version }'`
        );
    }

    async function applyUpdate({ sql }) {
        await db.query(sql.toString());
    }

    async function doUpdate() {
        const settings = await getSettings();
        for (const [_, update] of updates.entries()) {
            if (update.version > (settings.version || "0000000")) {
                await applyUpdate(update);
                await upsertVersion(update.version);
                console.log(`Updated to version ${ update.version }`);
            }
        }
    }

    return {
        doUpdate,
    };
}

module.exports = Updater;
