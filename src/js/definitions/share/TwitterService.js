var KanColleWidget;
(function (KanColleWidget) {
    var ServiceTwitter = (function () {
        function ServiceTwitter() {
            this.oauth = chrome.extension.getBackgroundPage()['oauth'];
        }
        ServiceTwitter.alreadyAuthenticated = function () {
            var oauth = chrome.extension.getBackgroundPage()['oauth'];
            return oauth.hasToken();
        };
        ServiceTwitter.authenticate = function () {
            // return KanColleWidget.Controller.sendMessage("TwitterAuthorize");
        };
        ServiceTwitter.prototype.getProfile = function () {
            var deferred = $.Deferred();
            var apiUrl = "https://api.twitter.com/1.1/account/verify_credentials.json";
            this.oauth.sendSignedRequest(
                apiUrl,
                function(res){
                    deferred.resolve(JSON.parse(res));
                },
                {method:"GET"}
            );
            return deferred.promise();
        };

        ServiceTwitter.prototype.tweetWithImageURI = function (imageURI, type, status) {
            if (typeof status === "undefined") { status = ''; }
            var deferred = $.Deferred();

            var apiUrl = 'https://api.twitter.com/1.1/statuses/update_with_media.json';
            var options = {
                method: "POST",
                parameters: {
                    status: status
                }
            };
            var callback = function (response, xhr) {
                response = JSON.parse(response);
                if (xhr.status !== 200)
                    deferred.reject(response); else
                    deferred.resolve(response);
            };

            var base64imageURI = imageURI;
            var blob = this.uri2blob(base64imageURI, type);

            var formData = new FormData();
            formData.append("media[]", blob);

            options['body'] = formData;
            this.oauth.sendSignedRequest(apiUrl, callback, options);
            return deferred.promise();
        };

        ServiceTwitter.prototype.uri2blob = function (uri, type) {
            uri = uri.split("base64,")[1] || uri;
            var bin = atob(uri);
            var len = bin.length;
            var barr = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                barr[i] = bin.charCodeAt(i);
            }

            return new Blob([barr.buffer], { type: type });
        };
        ServiceTwitter.getPermalinkFromSuccessResponse = function (response) {
            var baseURL = 'https://twitter.com';
            var tweetIdStr = response['id_str'];
            var userScreenName = response['user']['screen_name'];
            return [
                baseURL,
                userScreenName,
                'status',
                tweetIdStr
            ].join('/');
        };
        ServiceTwitter.STATUS_MAX_LENGTH = 140;
        ServiceTwitter.SETTINGS_APPLICATION_URL = 'https://twitter.com/settings/applications';
        return ServiceTwitter;
    })();
    KanColleWidget.ServiceTwitter = ServiceTwitter;
})(KanColleWidget || (KanColleWidget = {}));

