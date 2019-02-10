const path                 = require('path'),
      webpack              = require('webpack'),
      HtmlWebpackPlugin    = require('html-webpack-plugin'),
      dotenv               = require('dotenv');


// call dotenv and it will return an Object with a parsed key
const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
    if (next.substr(0, 9) === 'REACT_APP') {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
    }
    return prev;
}, {});

module.exports = {
    context: path.join(__dirname, 'src'),
    mode:    'development',
    entry:   [
        // Add the client which connects to our middleware
        // You can use full urls like 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
        // useful if you run your app from another point like django
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        // And then the actual application
        './index.js',
    ],
    output:  {
        path:     path.resolve(__dirname, 'dist'),
        filename: './bundle.js'
    },
    module:  {
        rules: [
            {
                test:    /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:     {
                    loader: "babel-loader"
                }
            },
            {
                test:    /\.(png|jpg)$/,
                exclude: /node_modules/,
                use:     {
                    loader: "file-loader"
                }
            },
            {
                test:    /\.html$/,
                exclude: /node_modules/,
                use:     [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader', 'postcss-loader',
                ],
            },
        ]
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     filename: 'styles.css',
        //     chunkFilename: 'styles.css'
        // }),
        new webpack.DefinePlugin(envKeys),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            'template': './index.html',
            'inject':   'body'
        })
    ]
};
