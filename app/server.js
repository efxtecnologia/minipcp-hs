const yargs = require("yargs/yargs"),
      { hideBin } = require("yargs/helpers"),
      argv = yargs(hideBin(process.argv)).argv,
      Components = require("./components.js");

function Server() {
    function run() {
        const components = Components(argv.config),
              updater = components.Updater(components),
              app = components.app,
              port = components.config.serverPort;

        updater.doUpdate();

        app.listen(port, () => {
            if ( components.config.dockerized ) {
                console.log("We are running inside a container");
            }
            if ( components.config.debug ) {
                console.log(components.config.config);
            }
            console.log(`Listening at http//localhost:${port}`);
        });
    }

    return {
        run,
    };
}

const server = Server();
server.run();
