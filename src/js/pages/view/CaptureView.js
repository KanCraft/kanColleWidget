var widgetPages = widgetPages || {};

(function(){
    var PaintToolView /* = widgetPages.PaintToolView */ = function(){
        this.tpl = ''
        + '<div class="wrapper">'
        + '  <form name="tools" id="tool-form">'
        + '  </form>'
        + '</div>';
        this.list = [
            {name:'Rect',checked:true},
            {name:'Curve'}
        ];
        this.actionList = [
            {name: 'Undo'},
            {name: 'Reset'}
        ];
    };
    Util.extend(PaintToolView, widgetPages.View);
    PaintToolView.prototype.render = function(){
        this.apply()._render();
        this.renderList();
        this.renderColorPicker();
        this.renderActions();
        return this.$el;
    };
    PaintToolView.prototype.renderList = function(){
        for (var i in this.list) {
            var tool = this.list[i];
            var $label = $('<label class="tool-picker clickable tool-config"></label>');
            var $radio = $('<input type="radio" name="draw-tool">');
            $radio.attr({value: tool.name});
            if (tool.checked) $radio.attr({checked:true});
            var $img = $('<img>').attr({src: "../img/capture/" + tool.name + ".png"});

            this.$el.find('#tool-form').append($label.append($radio, $img));
        };
    };
    PaintToolView.prototype.renderActions = function() {
        var str = '';
        for (var i in this.actionList) {
            var action = this.actionList[i];
            str += '<label class="paint-action" action="'+action.name+'"><img src="../img/capture/'+action.name+'.png"></label>';
        }
        this.$el.find('#tool-form').append(str);
    };
    PaintToolView.prototype.renderColorPicker = function(){
        var $input = $('<label><input type="color" name="color" id="color" value="#252525"></label>').addClass('tool-config');
        this.$el.find('#tool-form').append($input);
    };
    var CaptureView = widgetPages.CaptureView = function(){
        this.toolView = new PaintToolView();
        this.tpl = ''
        +'<div>'
        +'  <div id="tools">'
        +'  </div>'
        +'  <div>'
        +'    <canvas id="canvas" width="600" height="480"></canvas>'
        +'  </div>'
        +'  <div>'
        +'    <small id="filename">{{fileName}}</samll><br>'
        +'    <input type="submit" id="download" value="ダウンロード"/>'
        +'    <small>ファイル名は設定から変更可能です</small><a id="download-anchor" download="{{fileName}}" href=""></a>'
        +'  </div>'
        +'</div>';
        this.events = {
            'click #download': 'downloadCurrentImage'
        };
        this.canvasApp = null;
    };
    Util.extend(CaptureView, widgetPages.View);
    CaptureView.prototype.render = function(){
        this.apply({
            fileName: Util.getCaptureFilename()
        })._render();
        this.$el.find('#tools').append(
            this.toolView.render()
        );
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
