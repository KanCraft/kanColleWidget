/**
 * このファイルは巨大になる気がするけど、まあいいよね
**/

// いずれchromeネームスペースが状態を持たなきゃいけなくなる気もするので、
// クロージャーで返す
var chrome = (() => {
    return {
        extension: {
            getURL: () => {
                return "this is default";
            },
        },
    };
})();
Object.defineProperty(window, "chrome", {value:chrome});
