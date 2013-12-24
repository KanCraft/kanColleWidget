var widgetPages = widgetPages || {};

(function(){
    var CaptureView = widgetPages.CaptureView = function(imgURI){
        this.imgURI = imgURI;
        this.tpl = '<div><img id="capture" src="{{imgURI}}"></div>'
                 + '<div>'
                 + '    <input id="filename" type="text" placeholder="/^[a-zA-Z0-9_]+$/" value="{{defaultFilename}}">'
                 + '    <input id="download" type="submit" value="ダウンロードする">'
                 + '</div>'
                 + '<div><span id="warning" style="font-size:x-small">ファイル名は[a-zA-Z0-9_]のみ使用できます</span></div>';
        this.events = {
            'click #download' : 'downloadImg'
        };
    };
    CaptureView.prototype = Object.create(widgetPages.View.prototype);
    CaptureView.prototype.constructor = CaptureView;

    CaptureView.prototype.render = function(){
        var defaultFilePrefix = "KanColle";
        var formattedTime = $.map(
            (new Date()).toLocaleString().split(/[\/ :]/),
            function(s,i){
                //if(i == 0) return s;
                if(i == 0) return '';
                return Util.zP(2,s);
            }
        ).join('');
        this.apply({
            imgURI          : this.imgURI,
            defaultFilename : defaultFilePrefix + formattedTime
        })._render();
        return this.$el;
    };
    CaptureView.prototype.downloadImg = function(ev, self){
        var imgTitle = self.$el.find('#filename').val();

        if (! this.isValidFinename(imgTitle)) return;

        var a = document.createElement('a');
        a.href     = self.imgURI;
        a.download = imgTitle;
        //a.click();
    };
    CaptureView.prototype.isValidFinename = function(fname){
        if (fname.match(/^[a-zA-Z0-9_]+$/)) return true;
        this.$el.find('#warning').css({color:'red'});
        return false;
    };
})();
