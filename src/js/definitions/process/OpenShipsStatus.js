/* jshint indent: 4 */
var KanColleWidget = KanColleWidget || {};
(function(){
    'use strict';
    var Process = KanColleWidget.Process = KanColleWidget.Process || {};

    var OpenShipsStatus = Process.OpenShipsStatus = function() {};

    OpenShipsStatus.prototype.open = function() {
        var options = {format:'jpeg', quality:10};
        var self = this;
        Util.getWidgetWindowCapture(function(dataURI){
            var c_s = self._getCoordsAndSize(dataURI);
            var trimmedURI = Util.trimImage(dataURI, c_s.coords, c_s.size);
            // Viewにしたほうがいいかな？
            var widget = Tracking.get('widget');
            var params = [
                "top="  + String(parseInt(widget.position.top) - 230),//なんだこの数字
                "left=" + widget.position.left,// + widget.size.outerWidth,
                "width=174",
                "height=203"
            ];
            var win = window.open(trimmedURI,"_blank", params.join(","));
            /* FIXME: window title変えたいけどViewつくるほどじゃない
            var d = new Date();
            win.title = Util.zP(2, d.getHours()) + ':' + Util.zP(2, d.getMinutes());
            */
        },options);
    };
    OpenShipsStatus.prototype._getCoordsAndSize = function(dataURI) {
        var img = new Image();
        img.src = dataURI;

        var coordsAndSize = {
            coords : {
                left : img.width  * (1/5),
                top  : img.height * (3/8)
            },
            size : {
                width : img.width  * (3/10),
                height: img.height * (7/12)
            }
        };
        return coordsAndSize;
    };
})();
