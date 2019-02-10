const postCssPresetEnv = require('postcss-preset-env'),
      postCssImport    = require('postcss-import');

module.exports = {
    plugins: [
        postCssPresetEnv,
        postCssImport
    ]
};