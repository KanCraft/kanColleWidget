var path = require("path");
// var webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = [
    {
        mode: process.env.NODE_ENV || "development",
        optimization: {
            minimize: process.env.NODE_ENV == "production",
        },
        entry: {
            background: "./src/js/entrypoints/background.ts",
            popup:      "./src/js/entrypoints/popup.ts",
            dmm:        "./src/js/entrypoints/dmm.ts",
        },
        output: {
            path: path.resolve(__dirname, "./dest/js"),
            filename: "[name].js"
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    options: { appendTsSuffixTo: [/\.vue$/] }
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".js", ".vue"]
        },
        plugins: [
            new VueLoaderPlugin(),
        ],
        performance: {
            hints: false,
        },
    },
    {
        mode: process.env.NODE_ENV || "development",
        entry: {
            index: "./src/css/entrypoints/index.scss",
        },
        output: {
            path: path.resolve(__dirname, "dest/css"),
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        {loader: MiniCssExtractPlugin.loader},
                        // {loader: "style-loader"},
                        {loader: "css-loader"},
                        {loader: "sass-loader"},
                    ],
                },
                // {
                //     test: /\.(eot|woff|woff2|ttf|svg)$/,
                //     loaders: ['url-loader']
                // },
            ]
        },
        resolve: {
            extensions: [".scss", ".css"]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
                path: path.resolve(__dirname, "dest/css"),
            }),
        ],
    }
];

