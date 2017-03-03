
export default class HTTPClient {
  post(url, params) {
    return this.request("POST", url, params);
  }
  html(url) {
    return this._request("GET", url, {});
  }
  get(url, params) {
    return this.request("GET", url, params);
  }
  _request(method, url, params) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    const p = new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState != XMLHttpRequest.DONE) return;
        if (xhr.status >= 400) return reject({status: xhr.status,message: xhr.statusText});
        return resolve({response: xhr.responseText});
      };
    });
    xhr.send(JSON.stringify(params));
    return p;
  }
  request(method, url, params) {
    return this._request(method, url, params).then(({response}) => {
      return Promise.resolve(JSON.parse(response));
    });
  }
}
