/* jshint indent: 4 */
var KanColleWidget = KanColleWidget || {};
(function(){
    'use strict';
    var Process = KanColleWidget.Process = KanColleWidget.Process || {};

    var OpenShipsStatus = Process.OpenShipsStatus = function() {};

    OpenShipsStatus.prototype.open = function() {
        var options = {format:'jpeg'};
        var self = this;
        Util.getWidgetWindowCapture(function(dataURI){
            var c_s = self._getCoordsAndSize(dataURI);
            var trimmedURI = Util.trimImage(dataURI, c_s.coords, c_s.size);
            // Viewにしたほうがいいかな？
            var widget = Tracking.get('widget');
            var params = [
                "top="  + String(parseInt(widget.position.top) - 230),//なんだこの数字
                "left=" + widget.position.left,// + widget.size.outerWidth,
                "height="+ String(parseInt(widget.size.innerHeight) * 7/12),
                "width=" + String(parseInt(widget.size.innerHeight) * 1/2)
            ];
            var url = chrome.extension.getURL('/') + 'src/html/ships_status.html';
            url += "?imgURI=" + trimmedURI;
            KanColleWidget.Stash.statusWindow = window.open(url,"_blank", params.join(","));
            Util.adjustSizeOfWindowsOS(KanColleWidget.Stash.statusWindow);
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
