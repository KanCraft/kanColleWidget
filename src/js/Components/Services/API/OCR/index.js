import HTTPClient from "../HTTPClient"; // 上流をimportってしていい哲学だっけ？

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
