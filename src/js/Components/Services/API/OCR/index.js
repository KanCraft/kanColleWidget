
class HTTPClient {
    post(url, params) {
        return this.request("POST", url, params);
    }
    get(url, params) {
        return this.request("GET", url, params);
    }
    request(method, url, params) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        const p = new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState != XMLHttpRequest.DONE) return;
                if (xhr.status >= 400) return reject({status: xhr.status,message: xhr.statusText});
                return resolve(JSON.parse(xhr.responseText));
            };
        });
        xhr.send(JSON.stringify(params));
        return p;
    }
}

export default class OCR {
    constructor(http = new HTTPClient()) {
        this.http = http;
    }
    status() {
        return this.http.get(this.endpoint("/status"));
    }
    execute(base64, params = {whitelist: "0123456789:", trim: "\n"}) {
        return this.http.post(this.endpoint("/base64"), {base64, ...params});
    }
    endpoint(path) {
        return "http://ocr-kcwidget.herokuapp.com" + path;
    }
}
