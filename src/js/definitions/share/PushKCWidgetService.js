var KanColleWidget;
(function (KanColleWidget) {
    var ServicePushKCWidget = (function () {
        function ServicePushKCWidget() {
        }
        ServicePushKCWidget.prototype.enqueueEvent = function(soloEventModel) {
            console.log("enqueueEventにきたやつ\n", soloEventModel);
            var deferred = $.Deferred();
            var path = "/queue/add";
            var url = Util.getPushServerURL() + path;
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    id_str: Config.get('twitter-id-str'),
                    message: soloEventModel.toMessage(),
                    kind: soloEventModel.kind,
                    client_token: Constants.pushServer.token,
                    finish: Math.floor(soloEventModel.finish / 1000),
                    optional: soloEventModel.info || {}
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

