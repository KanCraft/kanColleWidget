var KanColleWidget;
(function (KanColleWidget) {
    var ServicePushKCWidget = (function () {
        function ServicePushKCWidget() {
        }
        ServicePushKCWidget.prototype.enqueueEvent = function(soloEventModel) {
            var deferred = $.Deferred();
            var path = "/queue/add";
            var url = Util.getPushServerURL() + path;
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    finish: Math.floor(soloEventModel.finish / 1000), // タイムスタンプ
                    id_str: Config.get('twitter-id-str'), // TwitterIdStr
                    message: soloEventModel.toMessage(),  // 第2艦隊が遠征から帰投します的な
                    label: soloEventModel.label,          // 遠征帰投
                    prefix: soloEventModel.prefix,        // 第
                    identifier: soloEventModel.primaryId, // 2
                    unit: soloEventModel.unit,            // 艦隊
                    kind: soloEventModel.kind,            // mission-finish
                    client_token: Constants.pushServer.token,
                    missionTitle: (soloEventModel.info) ? soloEventModel.info.MissionTitle : "",
                    missionId: (soloEventModel.info) ? soloEventModel.info.MissionId : ""
                },
                success: function(res) {
                    deferred.resolve(res);
                },
                error: function(err) {
                    window.alert("なんかエラー\n" + JSON.stringify(err));
                }
            });
            return deferred.promise();
        };
        return ServicePushKCWidget;
    })();
    KanColleWidget.ServicePushKCWidget = ServicePushKCWidget;
})(KanColleWidget || (KanColleWidget = {}));

