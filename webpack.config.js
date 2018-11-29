var path = require("path");
var webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = [
    {
        mode: process.env.NODE_ENV || "development",
        optimization: {
            minimize: process.env.NODE_ENV == "production",
            minimizer: [new UglifyJsPlugin({ uglifyOptions: { mangle: false } })],
        },
        entry: {
            background: "./src/js/entrypoints/background.ts",
            popup:      "./src/js/entrypoints/popup.tsx",
            options:    "./src/js/entrypoints/options.tsx",
            capture:    "./src/js/entrypoints/capture.tsx",
            deckcapture:"./src/js/entrypoints/deckcapture.tsx",
            dmm:        "./src/js/entrypoints/dmm.ts",
            kcs2:       "./src/js/entrypoints/kcs2.ts",
            dsnapshot:  "./src/js/entrypoints/dsnapshot.tsx",
        },
        output: {
            path: path.resolve(__dirname, "./dest/js"),
            filename: "[name].js"
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "awesome-typescript-loader",
                },
            ]
        },
        resolve: {
            extensions: [".ts", ".js", ".tsx"]
        },
        plugins: [
            new webpack.DefinePlugin({'NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
        ],
        performance: {
            hints: false,
        },
    },
    {
        mode: process.env.NODE_ENV || "development",
        entry: {
            common:      "./src/css/entrypoints/common.scss",
            options:     "./src/css/entrypoints/options.scss",
            popup:       "./src/css/entrypoints/popup.scss",
            dsnapshot:   "./src/css/entrypoints/dsnapshot.scss",
            deckcapture: "./src/css/entrypoints/deckcapture.scss",
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

