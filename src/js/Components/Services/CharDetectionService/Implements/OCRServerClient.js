class HTTPClient {
  constructor(hostURL) {
    this.hostURL = hostURL;
  }
  cleanURL(h, p) {
    return [h.replace(/\/$/, ''), p.replace(/^\//, '')].join('/');
  }
  post(path, body) {
    return new Promise((resolve, reject) => {
      resolve({result: '03:00:00'});
    });
  }
}

export default class OCRServerClient extends HTTPClient {
  fromBase64(base64string, whitelist = '0123456789:') {
    return this.post('/base64', {
      base64: base64string,
      whitelist: whitelist,
      trim: '\n'
    })
  }
}
