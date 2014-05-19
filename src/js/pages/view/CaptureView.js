var widgetPages = widgetPages || {};

(function(){
    var PaintTextOptionView = function(){
        this.tpl = ''
        + '<div id="text-options" style="display:none;">'
        + '  <input type="text" id="text-value" size="40">'
        + '  <select name="text-size" id="text-size">'
        + '    <option value="0.5em">0.5em</option>'
        + '    <option value="1em">1em</option>'
        + '    <option value="2em">2em</option>'
        + '    <option value="4em" selected>4em</option>'
        + '    <option value="8em">8em</option>'
        + '    <option value="16em">16em</option>'
        + '  </select>'
        + '  <select name="text-font" id="text-font">'
        + '    <option value="Helvetica" selected>Helvetica</option>'
        + '    <option value="Trebuchet MS">Trebuchet MS</option>'
        + '    <option value="arial black">Arial black</option>'
        + '    <option value="Comic Sans MS">Comic Sans MS</option>'
        + '    <option value="serif">Serif</option>'
        + '  </select>'
        + '</div>';
    };
    Util.extend(PaintTextOptionView, widgetPages.View);
    PaintTextOptionView.prototype.render = function(){
        this.apply()._render();
        return this.$el;
    };
    var PaintToolView /* = widgetPages.PaintToolView */ = function(){
        this.tpl = ''
        + '<div class="wrapper">'
        + '  <form name="tools" id="tool-form">'
        + '  </form>'
        + '</div>';
        this.list = [
            {name:'Rect',checked:true},
            {name:'Curve'},
            {name:'Trim'},
            {name:'Text'}
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
            var $img = $('<img>').attr({src: "../img/capture/" + tool.name + ".png",title:tool.name});

            this.$el.find('#tool-form').append($label.append($radio, $img));
        };
    };
    PaintToolView.prototype.renderActions = function() {
        var str = '';
        for (var i in this.actionList) {
            var action = this.actionList[i];
            str += '<label class="paint-action clickable" action="'+action.name+'"><img src="../img/capture/'+action.name+'.png" title="'+action.name+'"></label>';
        }
        this.$el.find('#tool-form').append(str);
    };
    PaintToolView.prototype.renderColorPicker = function(){
        var $input = $('<label><input type="color" name="color" id="color" value="#252525"></label>').addClass('tool-config');
        this.$el.find('#tool-form').append($input);
    };
    var CaptureView = widgetPages.CaptureView = function(){
        this.toolView = new PaintToolView();
        this.textOptionView = new PaintTextOptionView();
        this.tpl = ''
        +'<div>'
        +'  <div id="tools">'
        +'  </div>'
        +'  <div>'
        +'    <canvas id="canvas" width="600" height="480"></canvas>'
        +'  </div>'
        +'  <div>'
        +'    <input type="text" id="_directory" value="{{dir}}" size="10">/<input type="text" id="_filename" value="{{file}}" size="40">.{{format}}<br>'
        +'    <label><button id="download" class="plain">'
        +'      <img src="../img/capture/download.png" title="Download" class="clickable file-action">'
        +'    </button></label>'
        +'    <label><button id="newWindow" class="plain">'
        +'      <img src="../img/capture/new_window.png" title="New Window" class="clickable file-action">'
        +'    </button></label>'
        +'    <label id="label-tweet" style="display:none;"><button id="tweet" class="plain">'
        +'      <img id="img-tweet" src="../img/capture/twitter.png" title="Share to Twitter" class="clickable file-action">'
        +'    </button></label>'
        +'    <a id="download-anchor" download="{{filename}}" href=""></a>'
        +'  </div>'
        +'</div>';
        this.events = {
            'click #download': 'downloadCurrentImage'
        };
        this.canvasApp = null;
        this.twitter = new KanColleWidget.ServiceTwitter();
        this.nowSending = false;
    };
    Util.extend(CaptureView, widgetPages.View);
    CaptureView.prototype.render = function(){
        this.apply({
            filename: Util.getCaptureFilenameFull(),
            file: Util.getCaptureFilename(),
            dir: Config.get('capture-image-download-dir'),
            format: Config.get('capture-image-format').replace('e','')
        })._render();
        this.$el.find('#tools').append(
            this.toolView.render(),
            this.textOptionView.render()
        );
        this.imgURI = Util.parseQueryString()['uri'];
        this._delegate();
        return this.$el;
    };
    CaptureView.prototype._delegate = function(){
        // これはrenderのバグなので、悔しい
        var self = this;
        this.$el.find('#newWindow').on('click',function(){
            var format = 'image/' + Config.get('capture-image-format');
            window.open(
                self.canvasApp.toDataURL(format),
                '_blank'
            );
        });
        this.$el.find(':radio[name="draw-tool"]').on('change',function(){
            if ($(this).val() == 'Text') {
                return $('#text-options').show();
            }
            return $('#text-options').hide();
        });
        if (Config.get('auth-twitter') && this.twitter.oauth.hasToken()) {
            this.$el.find('#label-tweet').show();
        }
        this.$el.find('#tweet').on('click',function(ev){
            self.tweetWithImageURI(ev, self);
        });
    };
    CaptureView.prototype.startApp = function() {
        this.canvasApp = KanColleWidget.Canvas.initWithURI(this.imgURI);
        this.canvasApp.listen();
    };
    CaptureView.prototype.downloadCurrentImage = function(ev, self) {
        var filename = $('#_filename').val() || Util.getCaptureFilename();
        var dirname = $('#_directory').val();
        var ext = Config.get('capture-image-format');
        $('a#download-anchor').attr('download', filename + '.' + ext);
        var format = 'image/' + Config.get('capture-image-format');
        $('a#download-anchor').attr('href', this.canvasApp.toDataURL(format))
        chrome.runtime.sendMessage(null,{
            purpose: 'download',
            data: {
                format: format,
                file: filename,
                dir: dirname,
                url: this.canvasApp.toDataURL(format)
            }
        });
    };
    CaptureView.prototype.tweetWithImageURI = function(ev, self) {

        if (this.nowSending) return;

        var format = 'image/' + Config.get('capture-image-format');
        var uri = this.canvasApp.toDataURL(format);

        var $contents = new ModalContentTweetView(uri, format, this.twitter).render();
        var modal = new widgetPages.ModalView($contents);
        modal.render().show();
        $('#tweet-cancel').on('click', function(){
            widgetPages.ModalView.vanish();
        });
    };
    // TODO: いい加減このファイル分割しろ
    var ModalContentTweetView = function(imgURI, format, twitter) {
        this.imgURI = imgURI;
        this.format = format;
        this.twitter = twitter;
        this.tpl = ''
        + '<div id="modal-contents-twitter-wrapper">'
        + '    <div class="modal-header">'
        + '        <span id="tweet-cancel" class="pull-right clickable">×</span>'
        + '        <h3 class="modal-title" id="global-tweet-dialog-header">ツイートする</h3>'
        + '    </div>'
        + '    <div class="modal-body modal-tweet" id="global-tweet-dialog-body"></div>'
        + '    <div class="modal-tweet-form-container">'
        + '        <div>'
        + '            <div class="tweet-content">'
        + '                <div class="tweet-box" id="js-tweet-box" contenteditable="true"></div>'
        + '            </div>'
        + '            <div class="toolbar js-toolbar">'
        + '                <div class="tweet-box-extras">'
        + '                    <div id="tweet-image-container">'
        + '                      <img src="{{imgURI}}" />'
        + '                    </div>'
        + '                </div>'
        + '                <div class="tweet-button">'
        + '                    <span class="spinner"></span>'
        + '                    <span class="tweet-counter" id="tweet-text-counter">125</span>'
        + '                    <button class="btn btn-info btn-large tweet-action tweet-btn" id="js-tweet-btn" type="button">'
        + '                        <span class="button-text tweeting-text">'
        + '                          ツイート'
        + '                        </span>'
        + '                    </button>'
        + '                </div>'
        + '            </div>'
        + '        </div>'
        + '    </div>'
        + '</div>';
    };
    Util.extend(ModalContentTweetView, widgetPages.View);
    ModalContentTweetView.prototype.render = function() {
        this.apply({imgURI:this.imgURI})._render();
        var imgURI = this.imgURI;
        var self = this;
        this.$el.find('#js-tweet-btn').on('click',function(ev){
            self.sendTweet(ev, self);
        });
        this.$el.find('#js-tweet-box').on('keydown',function(ev){
            self.textFeedback(ev,self);
        });
        var hashtag = Config.get('tweet-hashtag');
        if (hashtag) {
            this.$el.find('#js-tweet-box').html('&nbsp;' + hashtag);
        }
        return this.$el;
    };
    ModalContentTweetView.prototype.sendTweet = function(ev, self) {
        if (self.nowSending) return;
        self.nowSending = true;
        $(ev.currentTarget).addClass('disabled');
        $('#tweet-text-counter').html('');
        $('#tweet-text-counter').addClass('loader');
        var status = this.getInputStatus();
        var p = self.twitter.tweetWithImageURI(this.imgURI, this.format, status);
        p.done(function(res){
            var url = KanColleWidget.ServiceTwitter.getPermalinkFromSuccessResponse(res);
            $('body').append('<a href="'+url+'" target="_blank" class="tweeted-permalink">' + url + '</a><br/>')
            widgetPages.ModalView.vanish();
            self.nowSending =false;
        });
    };
    ModalContentTweetView.prototype.textFeedback = function(ev, self) {
        var text = ev.currentTarget.innerText;
        var len = text.length;
        self.$el.find('#tweet-text-counter').text(125 - len);
        if (len > 125) {
            self.$el.find('#tweet-text-counter').addClass('count-over');
        } else {
            self.$el.find('#tweet-text-counter').removeClass('count-over');
        }
    };
    ModalContentTweetView.prototype.getInputStatus = function() {
        return $('#js-tweet-box').html().replace(/<div>/g,'\n').replace(/<\/div>/g,'');
    };
})();
