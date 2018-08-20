var path = require("path");
var webpack = require("webpack");

module.exports = [
    {
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

