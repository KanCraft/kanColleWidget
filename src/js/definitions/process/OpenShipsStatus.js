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
            var widget =       Tracking.get('widget');
            var params = [
                "top="  + statusWindow.position.top,
                "left=" + statusWindow.position.left,
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

        var blank = this._getBlank(img.width, img.height);

        var coordsAndSize = {
            coords : {
                left : (img.width - blank.width)  * (1/5) + blank.left,
                top  : (img.height - blank.height) * (3/8) + blank.top
            },
            size : {
                width : (img.width - blank.width)  * (3/10),
                height: (img.height - blank.height) * (7/12)
            }
        };
        return coordsAndSize;
    };

    // とりあえずここでやるぞ！
    // 余黒対応
    OpenShipsStatus.prototype._getBlank = function(width, height) {
        var screen = {width:width, height:height};
        var aspect = 0.6;
        var blank = {top:0, left:0, height:0, width:0};
        if (screen.height / screen.width < aspect) {
            blank.width = screen.width - (screen.height / aspect);
            blank.left = blank.width / 2;
        } else {
            blank.height = screen.height - (screen.width * aspect);
            blank.top = blank.height / 2;
        }
        return blank; 
    };
})();
