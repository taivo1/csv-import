const express = require('express'),
      models  = require('./backend/models'),
      app     = express();

/**
 * For webpack
 */
(function() {

    // Step 1: Create & configure a webpack compiler
    const webpack       = require('webpack'),
          webpackConfig = require('./webpack.config'),
          compiler      = webpack(webpackConfig);

    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(require("webpack-dev-middleware")(compiler, {
        logLevel: 'warn', publicPath: webpackConfig.output.publicPath
    }));

    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
})();


/**
 * Rest of the server
 */

(async function() {
    try {
        // await new Promise(resolve => setTimeout(resolve, 20000));
        await models.sequelize.sync();

        const port = process.env.SERVER_PORT || 8080;

        app.use('/', require('./backend/routes.js'));

        app.listen(port, () => console.log(`App listening on port ${port}!`));

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();

