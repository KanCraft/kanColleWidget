
// XXX: これってRoutineなの？Serviceなの？ていうかRoutineってなに？
export default class CaptureWindowURL {
    constructor(now, maxExp = 6) {
        this.maxExp = maxExp;
        this.now    = now;
    }
    params(uri) {
        let params = new URLSearchParams();
        return Promise.resolve(params).then(p => {
            if (uri && uri.length < 1 * Math.pow(10, this.maxExp)) return Promise.resolve(p);
            else return Promise.reject(p);
        }).then(p => {
            p.set("img", uri);
            return Promise.resolve(p);
        }).catch(p => {
            const hash = `kcw:tmp:deckimage:${this.now}`;
            return new Promise(resolve => {
                chrome.storage.local.set({[hash]:uri}, () => {
                    p.set("datahash", hash);
                    resolve(p);
                });
            });
        });
    }
}
