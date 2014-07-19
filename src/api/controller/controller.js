var WidgetAPI;
(function(exports){
    var Controller = (function(){
        function Controller(message) {
            this.raw = message;
        }
        Controller.prototype.execute = function() {
            var d = $.Deferred();
            console.log("えぐぜく", this.message);
            if (Math.random() > 0.5) {
                d.resolve("せいこう");
            } else {
                d.reject({code:400, message:"なんかしっぱい"});
            }
            return d.promise();
        };
        return Controller;
    })();
    exports.Controller = Controller;
})(WidgetAPI || (WidgetAPI = {}));
