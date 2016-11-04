// TODO: devで出し分け
import {google} from "../../../../../../app-config.json";

export default class GoogleVisionAPIClient {
    constructor(config = {}) {
        const c = {...google, ...config};
        this.baseURL = c.vision_api_url;
        this.apiKey = c.api_key;
    }
    execute(base64string) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.url(), true);
        const p = new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState != XMLHttpRequest.DONE) return;
                if (xhr.status >= 400) return reject({status: xhr.status,message: xhr.statusText});
                return resolve(JSON.parse(xhr.responseText));
            };
        });
        xhr.send(JSON.stringify(this.buildParameters(base64string)));
        return p;
    }
    url() {
        return `${this.baseURL}?key=${this.apiKey}`;
    }
    buildParameters(base64string) {
        return {
            requests: [
                {
                    image: {content: base64string.replace(/^data:image\/(png|jpg);base64,/, "")},
                    features: [{type: "TEXT_DETECTION"}]
                }
            ]
        };
    }
}
