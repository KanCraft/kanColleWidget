export default class FileService {
    constructor(config, module = chrome) {
        this.config = config;
        this.module = module;
    }
    downloadImageURL(url) {
        const filename = this.getDownloadFolder() + "/" + this.getDownloadFilename(url);
        return new Promise(resolve => {
            this.module.downloads.download({url, filename}, resolve);
        });
    }
    getDownloadFolder() {
        return this.config.find("download-folder").value;
    }
    getDownloadFilename(url) {
        const [ , ext] = url.match(/data:image\/(jpeg|png);base64,/);
        const name = this.getDefaultDownloadFileName();
        return [name, ext].join(".");
    }
    getDefaultDownloadFileName(now = new Date()) {
        return now.format();
    }
}
