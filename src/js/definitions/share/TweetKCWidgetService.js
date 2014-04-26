var KanColleWidget;
(function (KanColleWidget) {
    var ServiceTweetKCWidget = (function () {
        function ServiceTweetKCWidget() {
        }
        ServiceTweetKCWidget.prototype.sendEventEnd = function(message) {
            var deferred = $.Deferred();
            var url = Util.getTweetServerURL() + '/tweet/nyukyo';
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    screen_name: Config.get('twitter-screen-name'),
                    message: message,
                    client_token: Constants.tweetServer.token
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

