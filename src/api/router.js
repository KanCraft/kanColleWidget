var WidgetAPI;
(function(exports){
    var routes = {
        "/api/subscribe": exports.SubscribeController
    };
    var Router = (function(){
        function Router() {

        }
        Router.resolve = function(message, sender) {
            return new routes["/api/subscribe"](message);
        };
        return Router;
    })();
    exports.Router = Router;
})(WidgetAPI || (WidgetAPI = {}));

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse){
    WidgetAPI.Router.resolve(message, sender).execute().done(function(response) {
        sendResponse({"status":200, "response":response});   
    }).fail(function(err){
        sendResponse({"status":err.code || 500, "message":err.message});
    });
});
