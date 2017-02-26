/* eslint-env worker */

export default function imports(root = "") {
    return function() {
        if (!root) throw "importScriptsする場合は必ずrootを指定してください";
        const _root = root.replace(/\/+$/, "") + "/";
        importScripts(...Array.prototype.map.call(arguments, path => _root + path));
    };
}
