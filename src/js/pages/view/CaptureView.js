var widgetPages = widgetPages || {};

(function(){
    var CaptureView = widgetPages.CaptureView = function(imgURI){
        this.imgURI = imgURI;
        this.tpl = '<div><img id="capture" src="{{imgURI}}"></div>'
                 + '<div>'
                 + '    <input id="filename" type="text" placeholder="ファイル名をつけて" value="">'
                 + '    <input id="download" type="submit" value="ダウンロードする">'
                 + '</div>';
        this.events = {
            'click #download' : 'downloadImg'
        };
    };
    CaptureView.prototype = Object.create(widgetPages.View.prototype);
    CaptureView.prototype.constructor = CaptureView;

    CaptureView.prototype.render = function(){
        this.apply({
            imgURI : this.imgURI
        })._render();
        return this.$el;
    };
    CaptureView.prototype.downloadImg = function(ev, self){
        var imgTitle = self.$el.find('#filename').val();
        if (! imgTitle) return;
        var a = document.createElement('a');
        a.href     = self.imgURI;
        a.download = imgTitle;
        a.click();
    };
})();
