const webpack = require('webpack');

module.exports = {
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //     },
    // },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
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
                loader: "less-loader", // compiles Less to CSS
            }
        ]
    }
};