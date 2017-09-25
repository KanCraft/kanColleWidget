import HTTPClient from "../HTTPClient"; // 上流をimportってしていい哲学だっけ？

export default class KCWidgetAPI {
  constructor(url, http = new HTTPClient()) {
    this.url = url;
    this.http = http;
  }
  status() {
    return this.http.get(this.endpoint("/status"));
  }
  ocr(base64, params = {whitelist: "0123456789:", trim: "\n"}) {
    return this.http.post(this.endpoint("/ocr/base64"), {base64, ...params});
  }
  convertWEBM(params = {}) {
    return this.http.post(this.endpoint("/video/convert"), {
      type: "blob",
      ...params,
    });
  }
  endpoint(path) {
    return this.url.replace(/\/+$/, "") + path;
  }
}
