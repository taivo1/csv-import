const express = require('express'),
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

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`App listening on port ${port}!`));