var widgetPages = widgetPages || {};

(function(){
    var PaintToolView /* = widgetPages.PaintToolView */ = function(){
        this.tpl = ''
        + '<div class="wrapper">'
        + '  <form name="tools" id="tool-form">'
        + '    <ul id="tool-list">'
        + '    </ul>'
        + '  </form>'
        + '  <div>'
        + '    <div id="inspector">'
        + '       <span></span>'
        + '    </div>'
        + '  </div>'
        + '</div>';
        this.selectedTool = 'fillRect';
    };
    PaintToolView.prototype = Object.create(widgetPages.View.prototype);
    PaintToolView.prototype.constructor = PaintToolView;
    PaintToolView.prototype.render = function(){
        var lists = '';
        for (var i in PaintToolView.toolList) {
            var tool = PaintToolView.toolList[i];
            lists += '<li ';
            if (tool.selected) {
                lists += 'class="selected"';
            };
            lists += '><img src="'+tool.icon+'"></li>';
        };
        this.apply()._render();
        this.$el.find('#tool-list').append(lists);
        return this.$el;
    };
    PaintToolView.prototype.renderList = function(){
    };
    PaintToolView.toolList = [
        {id:'fillRect',icon:'../img/square.png',selected:true}
    ];
    var CaptureView = widgetPages.CaptureView = function(){
        this.toolView = new PaintToolView();
        this.tpl = ''
        +'<table>'
        +'  <tr>'
        +'    <td>'
        +'      <div>'
        +'        <canvas id="canvas" width="600" height="480"></canvas>'
        +'      </div>'
        +'    </td>'
        +'    <td id="tools">'
        +'    </td>'
        +'  </tr>'
        +'  <tr>'
        +'    <td>'
        +'      <div>'
        +'        <small id="filename">{{fileName}}</samll><br>'
        +'        <input type="submit" id="download" value="ダウンロード"/>'
        +'        <small>ファイル名は設定から変更可能です</small><a id="download-anchor" download="{{fileName}}" href=""></a>'
        +'      </div>'
        +'    </td>'
        +'    <td>'
        +'    </td>'
        +'  </tr>'
        +'</table>'
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
        this.$el.find('#tools').append(this.toolView.render());
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
