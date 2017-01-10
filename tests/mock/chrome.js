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

const storage = (() => {
    var _local = {}, _sync = {};
    return {
        local: {
            set: (dictionary, callback) => {
                Object.keys(dictionary).map(key => {
                    _local[key] = dictionary[key];
                });
                callback();
            },
            get: (key, callback) => {
                // TODO: とりあえず
                let response = {};
                response[key] = _local[key];
                callback(response);
            }
        },
        test: (name) => {
            switch (name) {
            case "_local": return _local;
            default: return _sync;
            }
        }
    };
})();

Object.defineProperty(window, "chrome", {value: {
    extension,
    storage,
}});
