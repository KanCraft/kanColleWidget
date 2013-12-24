var widgetPages = widgetPages || {};

(function(){
    var CaptureView = widgetPages.CaptureView = function(imgURI){
        this.imgURI = imgURI;
        this.tpl = '<div><img id="capture" src="{{imgURI}}"></div>'
                 + '<div>'
                 + '<span class="filename">{{defaultFilename}}</span>'
                 + '    <a href="{{imgURI}}" download="{{defaultFilename}}"><input type="submit" value="ダウンロードする"></a>'
                 + '</div>'
                 + '<div><span id="warning" style="font-size:x-small">ファイル名はリッチな設定から変更可能です</span></div>';
    };
    CaptureView.prototype = Object.create(widgetPages.View.prototype);
    CaptureView.prototype.constructor = CaptureView;
    CaptureView.prototype.render = function(){
        this.apply({
            imgURI          : this.imgURI,
            defaultFilename : Util.getCaptureFilename()
        })._render();
        return this.$el;
    };
})();
