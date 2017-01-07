/**
 * このファイルは巨大になる気がするけど、まあいいよね
**/

const extension = (() => {
    return {
        getURL: () => {
            return "this is default";
        }
    };
})();

Object.defineProperty(window, "chrome", {value: {
    extension,
}});
