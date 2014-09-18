var KanColleWidget;
(function (KanColleWidget) {
    var ServicePushKCWidget = (function () {
        function ServicePushKCWidget() {
        }
        ServicePushKCWidget.prototype.enqueueEvent = function(soloEventModel) {
            var deferred = $.Deferred();
            var path = "/queue/add";
            var url = Util.getPushServerURL() + path;
            if (! Config.get('twitter-id-str')) {
                this.showAlert('Push通知を使う場合はTwitter認証しなおしてくだしあ');
                return deferred.reject();
            }
            // 一分前通知に対応（建造以外は全部1分前？）
            if (soloEventModel.kind != "createship-finish"){
                soloEventModel.finish = soloEventModel.finish - parseInt(Config.get("notification-offset-millisec"));
            }
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    clientToken: KanColleWidget.PushServerConfig.client_token,
                    finish: Math.floor(soloEventModel.finish / 1000), // タイムスタンプ
                    id_str: Config.get('twitter-id-str'), // TwitterIdStr
                    message: soloEventModel.toMessage(),  // 第2艦隊が遠征から帰投します的な
                    label: soloEventModel.label,          // 遠征帰投
                    prefix: soloEventModel.prefix,        // 第
                    identifier: soloEventModel.primaryId, // 2
                    unit: soloEventModel.unit,            // 艦隊
                    kind: soloEventModel.kind,            // mission-finish
                    missionTitle: (soloEventModel.info) ? soloEventModel.info.MissionTitle : "",
                    missionId: (soloEventModel.info) ? soloEventModel.info.MissionId : ""
                },
                success: function(res) {
                    if (res['code'] != 1000) {
                        ServicePushKCWidget.showAlert("code:" + res['code'] + "\nmessage:" + res['message']);
                        return deferred.reject(res);
                    }
                    deferred.resolve(res);
                },
                error: function(err) {
                    ServicePushKCWidget.showAlert(JSON.stringify(err));
                    deferred.reject(err);
                }
            });
            return deferred.promise();
        };
        ServicePushKCWidget.showAlert = function(message) {
            var header = "[ERROR:ServicePushKCWidget]\n";
            window.alert(header + message);
        };
        return ServicePushKCWidget;
    })();
    KanColleWidget.ServicePushKCWidget = ServicePushKCWidget;
})(KanColleWidget || (KanColleWidget = {}));

