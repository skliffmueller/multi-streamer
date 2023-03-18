const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: `${__dirname}/src/index.tsx`,
    output: {
        path: path.resolve(`${__dirname}/../dist`),
        filename: 'app.bundle.js',
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/\.spec\.ts$/, /node_modules/],
                use: 'babel-loader',
            },
            {
                test: /\.svg$/,
                use: 'svg-inline-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('postcss-import'),
                                    require('postcss-preset-env')({
                                        stage: 1,
                                    }),
                                    require('postcss-nesting'),
                                    require('tailwindcss')(require('./tailwind.config.js')),
                                    require('autoprefixer'),
                                ]
                            },
                        }
                    }
                ],
            },
            {
                test: /\.html$/i,
                use: 'html-loader',
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|mp4)$/,
                use: ["file-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: `${__dirname}/src/index.html`,
        })
    ],
    devtool: 'inline-source-map',
    // devServer: {
    //     static: path.resolve(`${__dirname}/../dist`),
    //     hot: true,
    //     // proxy: {
    //     //     '/thumbs':{
    //     //         target: 'http://localhost/',
    //     //         changeOrigin: true,
    //     //     },
    //     //     '/stats':{
    //     //         target: 'http://localhost/',
    //     //         changeOrigin: true,
    //     //     },
    //     //     '/api':{
    //     //         target: 'http://localhost/',
    //     //         changeOrigin: true,
    //     //     },
    //     //     '/recordings/**/*.(mp4|jpg|flv)':{
    //     //         target: 'http://localhost/',
    //     //         changeOrigin: true,
    //     //     },
    //     // },
    //     // historyApiFallback: true
    // }
};