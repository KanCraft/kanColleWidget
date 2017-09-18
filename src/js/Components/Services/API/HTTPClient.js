
export default class HTTPClient {
  post(url, params) {
    return this._request("POST", url, params);
  }
  html(url) {
    return this._request("GET", url, {type:"html"});
  }
  get(url, params) {
    return this._request("GET", url, params);
  }
  _request(method, url, params = {}) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (typeof params.headers == "object") {
      Object.keys(params.headers).map(key => {
        xhr.setRequestHeader(key, params.headers[key]);
      });
    }
    var p = new Promise(function(resolve, reject) {
      xhr.onload = function() {
        if (xhr.status >= 400) return reject({status: xhr.status, ...JSON.parse(xhr.response)});
        switch (params.type) {
        case "blob": return resolve(xhr.response);
        case "html": return resolve(xhr.response);
        default: return resolve(JSON.parse(xhr.responseText));
        }
      };
    });
    xhr.upload.onprogress = function(ev) {
      if (typeof p.onprogress == "function") p.onprogress(ev);
    };
    if (params.type == "blob") xhr.responseType = "blob";
    (params.type == "blob") ? xhr.send(params.body) : xhr.send(JSON.stringify(params));
    return p;
  }
}
