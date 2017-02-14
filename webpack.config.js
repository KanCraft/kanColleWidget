/* global process:false */
var webpack = require("webpack");
var Visualizer = require("webpack-visualizer-plugin");

var plugins = [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
    }),
    new Visualizer({
        filename: "./gh-pages/webpack.html",
    }),
];
if (process.env.NODE_ENV == "production") {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        mangle: false
    }));
}

module.exports = {
    entry: {
        options:    "./src/js/entrypoints/pages/options.js",
        popup:      "./src/js/entrypoints/pages/popup.js",
        dmm:        "./src/js/entrypoints/pages/dmm.js",
        osapi_dmm  :"./src/js/entrypoints/pages/osapi.dmm.js",
        capture:    "./src/js/entrypoints/pages/capture.js",
        stream:     "./src/js/entrypoints/pages/stream.js",
        deckcapture:"./src/js/entrypoints/pages/deckcapture.js",
        status:     "./src/js/entrypoints/pages/status.js",
        dashboard:  "./src/js/entrypoints/pages/dashboard.js",
        dsnapshot:  "./src/js/entrypoints/pages/dsnapshot.js",
        wiki:       "./src/js/entrypoints/pages/wiki.js",
        feedback:   "./src/js/entrypoints/pages/feedback.js",
        manual:     "./src/js/entrypoints/pages/manual.js",
        background: "./src/js/entrypoints/background.js",
    },
    output: {filename:"./dest/js/[name].js"},
    module: {
        loaders: [
            {test: /.jsx?$/, loader: "babel-loader"},
            {test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,loader: "url"},
            {test: /.json$/, loader: "json-loader"}
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    plugins: plugins
};
