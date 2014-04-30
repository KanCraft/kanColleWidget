var KanColleWidget;
(function (KanColleWidget) {
    var ServiceTweetKCWidget = (function () {
        function ServiceTweetKCWidget() {
        }
        ServiceTweetKCWidget.prototype.enqueueEvent = function(soloEventModel) {
            var deferred = $.Deferred();
            var path = soloEventModel.kind.split('-')[0];
            var url = Util.getTweetServerURL() + '/tweet/' + path;
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    screen_name: Config.get('twitter-screen-name'),
                    message: soloEventModel.toMessage(),
                    client_token: Constants.tweetServer.token,
                    finish_time: Math.floor(soloEventModel.finish / 1000)
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
        return ServiceTweetKCWidget;
    })();
    KanColleWidget.ServiceTweetKCWidget = ServiceTweetKCWidget;
})(KanColleWidget || (KanColleWidget = {}));

