const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports =  {
    mode: 'production',
    devtool: '',
    profile: true,
    entry: './src/index.js',
    output: {
        path: '/Users/edoardo/Documents/GitHub/sciexpem/FrontEnd/static/FrontEnd/', // Should be in STATICFILES_DIRS
        // filename: "[name]-[hash].js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,

                loader: "babel-loader",

                // options: {
                //     plugins: [
                //         ['import', { libraryName: "antd", style: "css" }]
                //     ]
                // },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader",
                    options: {
                        lessOptions: {
                            javascriptEnabled: true
                        }

                    }
                }]
            },

        ]
    },
    plugins: [
        // new BundleTracker({filename: './webpack-stats.json'}),
        new LodashModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
    ],

};


// const webpack = require('webpack');
// const path = require('path');
// const fs = require('fs');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
//
//
// // App directory
// const appDirectory = fs.realpathSync(process.cwd());
//
// // Gets absolute path of file within app directory
// const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);
//
// // Host
// const host = process.env.HOST || 'localhost';
//
// // Required for babel-preset-react-app
// // process.env.NODE_ENV = 'development';
//
// module.exports = {
//     entry: "./index.js",
//     output: {
//         path: path.resolve(__dirname, "../static/custom_webpack_conf_2/js"),
//         filename: "[name].js"
//     },
//
//
//     // // Entry point of app
//     // entry: resolveAppPath('src'),
//     //
//     // output: {
//     //
//     //     // Development filename output
//     //     filename: 'static/js/bundle.js',
//     // },
//     devServer: {
//
//         // Serve index.html as the base
//         contentBase: resolveAppPath('public'),
//
//         // Enable compression
//         compress: true,
//
//         // Enable hot reloading
//         hot: true,
//
//         host,
//
//         port: 3000,
//
//         // Public path is root of content base
//         publicPath: '/',
//
//     },
//     plugins: [
//         new CleanWebpackPlugin(),
//         new ManifestPlugin(),
//         new LodashModuleReplacementPlugin(),
//         // new webpack.optimize.LimitChunkCountPlugin({
//         //     maxChunks: 1
//         // }),
//         new HtmlWebpackPlugin({
//             inject: true,
//             template: resolveAppPath('public/index.html'),
//         }),
//     ],
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: "babel-loader"
//                 }
//             },
//             {
//                 test: /\.css$/,
//                 use: ['style-loader', 'css-loader'],
//             },
//             {
//                 test: /\.less$/,
//                 use: [
//                     'style-loader',
//                     'css-loader',
//                     'less-loader'
//                 ],
//             },
//
//         ]
//     }
// };
//
