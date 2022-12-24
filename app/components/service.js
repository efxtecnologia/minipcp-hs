const cors = require("cors"),
      fileUpload = require("express-fileupload"),
      bodyParser = require("body-parser"),
      bearerToken = require('express-bearer-token');

function Service({ config, app, express, router, auth, routes }) {
    routes.static.map(route => app.use(route.path, express.static(route.filePath)));
    app.use(cors({ exposedHeaders: "auth" }));
    app.use(bodyParser.json());
    app.use(bearerToken());
    app.use(fileUpload());
    routes.api.map(route => router[route.method](route.path, route.handler));
    app.use(auth.middleware);
    app.use(router);
    return app;
}

module.exports = Service;
