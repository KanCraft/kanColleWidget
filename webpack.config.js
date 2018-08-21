var path = require("path");
// var webpack = require("webpack");

module.exports = [
    {
        mode: process.env.NODE_ENV || "development",
        optimization: {
            minimize: process.env.NODE_ENV == "production",
        },
        entry: {
            background: "./src/js/entrypoints/background.ts",
            dmm:        "./src/js/entrypoints/dmm.ts",
        },
        output: {
            path: path.resolve(__dirname, "./dest/js"),
            filename: "[name].js"
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"]
        }
    },
    // TODO: これはいずれ消す
    {
        mode: process.env.NODE_ENV || "development",
        entry: "./src/js/hello-world.ts",
        output: {
            path: path.resolve(__dirname, "./dest/js"),
            filename: "hello-world.js"
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                }
            ]
        },
        resolve: {
            extensions: [".ts"]
        },
    }
];

