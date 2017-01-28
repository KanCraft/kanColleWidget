class URLSearchParams {
    constructor() {
        this.dictionary = {};
    }
    set(key, value) {
        this.dictionary[key] = value;
    }
    get(key) {
        return this.dictionary[key];
    }
    toString() {
        return Object.keys(this.dictionary).map(key => {
            return `${key}=${this.dictionary[key]}`;
        }).join("=");
    }
}
Object.defineProperty(window, "URLSearchParams", { value: URLSearchParams });
