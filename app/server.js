const yargs = require("yargs/yargs"),
      { hideBin } = require("yargs/helpers"),
      argv = yargs(hideBin(process.argv)).argv,
      System = require("./components.js");

function Server() {
    function run() {
        const components = System(argv.config).init(),
              app = components.app,
              port = components.config.serverPort;

        components.updater.doUpdate();

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
