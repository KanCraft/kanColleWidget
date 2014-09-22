/// <reference path="../../../../../definitions/kcwidget.d.ts" />
/// <reference path="../../../../../definitions/jquery.d.ts" />
module KCW {
    export class Server {
        constructor(private serverURL: string) {}
        public post(path: string, data: Object = {}): JQueryPromise {
            return this._send("POST", path, data);
        }
        private _send(method: string ,path: string, data: Object = {}): JQueryPromise {
            var deferred = $.Deferred();
            $.ajax({
                url: this.serverURL + path,
                type: method,
                data: data,
                success: (res) => {
                    deferred.resolve(res);
                },
                error: (err) => {
                    deferred.reject(err);
                }
            });
            return deferred.promise();
        }
    }
}
module KCW {
    export class ServicePush extends Server {
        constructor() {
            super("http://push-kcwidget.oti10.com");
        }
        public enqueueEvent(event: ObsoleteEventModel): JQueryPromise {
            var deferred = $.Deferred();
            if (! Config.get('twitter-id-str')) {
                this.showAlert('Push通知を使う場合はTwitter認証しなおしてくだしあ');
                return deferred.reject();
            }
            var params = this.makeEnqueueParamsFromEvent(event);
            var promise = this.post("/queue/add", params);
            promise.done((res) => {
                if (res['code'] != 1000) {
                    this.showAlert("code:" + res['code'] + "\nmessage:" + res['message']);
                    deferred.reject(res);
                } else {
                    deferred.resolve(res);
                }
            });
            promise.fail((err) => {
                this.showAlert(JSON.stringify(err));
                deferred.reject(err);
            });
            return deferred.promise();
        }
        private showAlert(message: string) {
            var header = "[ERROR:ServicePushKCWidget]\n";
            window.alert(header + message);
        }
        private makeEnqueueParamsFromEvent(event: ObsoleteEventModel): Object {
            var params: any = {};
            params.kind = event.kind;
            if (event.kind != "createship-finish"){
                params.finish = event.finish - parseInt(Config.get("notification-offset-millisec"));
            } else {
                params.finish = event.finish;
            }
            params.finish = Math.floor(params.finish / 1000);
            params.clientToken = KanColleWidget.PushServerConfig.client_token;
            params.id_str = Config.get('twitter-id-str');
            params.message = event.toMessage();  // 第2艦隊が遠征から帰投します的な
            params.label = event.label;          // 遠征帰投
            params.prefix = event.prefix;        // 第
            params.identifier = event.primaryId; // 2
            params.unit = event.unit;            // 艦隊
            params.kind = event.kind;        // mission-finish
            params.missionTitle = (event.info) ? event.info.MissionTitle : "";
            params.missionId = (event.info) ? event.info.MissionId : "";
            return params;
        }
    }
}
