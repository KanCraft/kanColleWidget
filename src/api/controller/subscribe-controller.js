var WidgetAPI;
(function(exports){
    var SubscribeController = (function(_super){
        __extends(SubscribeController, _super);
        function SubscribeController(message){
            _super.call(this, message);
        }
        return SubscribeController;
    })(exports.Controller);
    exports.SubscribeController = SubscribeController;
})(WidgetAPI || (WidgetAPI = {}));
