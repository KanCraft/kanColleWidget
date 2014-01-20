var widgetPages = widgetPages || {};

(function(){
    var CaptureView = widgetPages.CaptureView = function(){
        this.tpl = ''
        +'<div>'
        +'    <canvas id="canvas" width="600" height="480"></canvas>'
        +'</div>'
        +'<div>'
        +'    <small id="filename">{{fileName}}</samll><br>'
        +'    <input type="submit" id="download" value="ダウンロード"/>'
        +'    <small>ファイル名は設定から変更可能です</small><a id="download-anchor" download="{{fileName}}" href=""></a>'
        +'</div>';
        this.events = {
            'click #download': 'downloadCurrentImage'
        };
        this.canvasApp = null;
    };
    CaptureView.prototype = Object.create(widgetPages.View.prototype);
    CaptureView.prototype.constructor = CaptureView;
    CaptureView.prototype.render = function(){
        this.apply({
            fileName: Util.getCaptureFilename()
        })._render();
        this.imgURI = Util.parseQueryString()['uri'];
        return this.$el;
    };
    CaptureView.prototype.startApp = function() {
        this.canvasApp = KanColleWidget.Canvas.initWithURI(this.imgURI);
        this.canvasApp.listen();
    };
    CaptureView.prototype.downloadCurrentImage = function(ev, self) {
        var format = 'image/' + Config.get('capture-image-format');
        $('a#download-anchor').attr('href', this.canvasApp.toDataURL(format))
        $('a#download-anchor')[0].click();
    };
})();
