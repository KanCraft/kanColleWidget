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
            var statusWindow = Tracking.get('statusWindow');
            if (! statusWindow.size || ! statusWindow.position) statusWindow = Tracking.initial.statusWindow;
            var params = [
                "top="   + statusWindow.position.top,
                "left="  + statusWindow.position.left,
                "height="+ statusWindow.size.height,
                "width=" + statusWindow.size.width
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

        var blank = Util.getBlank(img.width, img.height);

        var coordsAndSize = {
            coords : {
                left : (img.width - blank.width)  * (141/500) + blank.offsetLeft,
                top  : (img.height - blank.height) * (3/8) + blank.offsetTop
            },
            size : {
                width : (img.width - blank.width)  * (43/200),
                height: (img.height - blank.height) * (7/12)
            }
        };
        return coordsAndSize;
    };
})();
