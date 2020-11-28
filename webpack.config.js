const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');


// App directory
const appDirectory = fs.realpathSync(process.cwd());

// Gets absolute path of file within app directory
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);

// Host
const host = process.env.HOST || 'localhost';

// Required for babel-preset-react-app
// process.env.NODE_ENV = 'development';

module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    output: {
        filename: '[name].[contenthash].js'
    },


    // // Entry point of app
    // entry: resolveAppPath('src'),
    //
    // output: {
    //
    //     // Development filename output
    //     filename: 'static/js/bundle.js',
    // },
    devServer: {

        // Serve index.html as the base
        contentBase: resolveAppPath('public'),

        // Enable compression
        compress: true,

        // Enable hot reloading
        hot: true,

        host,

        port: 3000,

        // Public path is root of content base
        publicPath: '/',

    },
    plugins: [
        new CleanWebpackPlugin(),
        new ManifestPlugin(),
        new LodashModuleReplacementPlugin(),
        // new webpack.optimize.LimitChunkCountPlugin({
        //     maxChunks: 1
        // }),
        new HtmlWebpackPlugin({
            inject: true,
            template: resolveAppPath('public/index.html'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ],
            },

        ]
    }
};

