var widgetPages = widgetPages || {};

(function(){
    // 入力計算用のやつ
    var modMinute = { range: 5, max: 59, min: 0, target: "input-minute" };
    var modHour = { range: 1, max: 100, min: 0,  target: "input-hour" };
    var Calc = function(key) {
        if (key === 'minute') this.model = modMinute;
        else if (key === 'hour') this.model = modHour;
    };
    Calc.prototype.getCurrent = function(){
        return $('#' + this.model.target).val();
    };
    Calc.prototype.up = function(){
        var before = this.getCurrent();
        var after = parseInt(before) + this.model.range;
        if (after > this.model.max) return Util.zP(2, this.model.min);
        return Util.zP(2, after);
    };
    Calc.prototype.down = function(){
        var before = this.getCurrent();
        var after = parseInt(before) - this.model.range;
        if (after < this.model.min) return Util.zP(2, this.model.max);
        return Util.zP(2, after);
    };
    /**
     * @static
     * 入力値をepochミリ秒にする
     * @param inputObj
     * @returns {number}
     */
    Calc.convert2Epoch = function(inputObj){
        var msecFromHour   = parseInt(inputObj.hour)*60*60*1000;
        var msecFromMinute = parseInt(inputObj.minute) *60*1000;
        return Date.now() + msecFromHour + msecFromMinute;
    };

    // Viewです
    var ManualTimerView = widgetPages.ManualTimerView = function(){};
    ManualTimerView.prototype = Object.create(widgetPages.View.prototype);
    ManualTimerView.prototype.constructor = ManualTimerView;
    ManualTimerView.prototype.tracking = Tracking;
    ManualTimerView.prototype.events = {
        // 本当はここで.upと.downで振り分けたいのだが(´･ω･`)
        'click div.caret' : 'editByCaret'
    };
    ManualTimerView.prototype.render = function(){
        var tracked = this.tracking.get(this.modelName) || this.tracked;
        this.apply({
            message : this.identifierName+this.purpose + "完了通知登録しますか？",
            hour    : tracked.hour,
            minute  : tracked.minute
        })._render();
        $('title').text(this.purpose + "完了通知設定画面");
        this._delegate();//クソだな。なんでView.bindEvents動かないの？
        return this.$el;
    };
    ManualTimerView.prototype.editByCaret = function(ev, self){
        var target = $(ev.target).attr('target');
        var calc = new Calc(target);
        var destValue = '';
        if ($(ev.target).hasClass('up')) destValue = calc.up();
        if ($(ev.target).hasClass('down')) destValue = calc.down();
        self._edit(target, destValue);
    };
    ManualTimerView.prototype._edit = function(targetName, value){
        var $target = $('#input-' + targetName);
        $target.val(value);
    };

    // View.bindEvents動かないよー(´・ω・`)
    ManualTimerView.prototype._delegate = function(){
        var self = this;
        this.$el.find('#register-commit').on('click',function(){
            self.registerReminder(self);
        });
        this.$el.find('#register-cancel').on('click',function(){
            self.cancel(self);
        });
    };
    ManualTimerView.prototype.registerReminder = function(self){
        var inputs = {hour: $('#input-hour').val(), minute:$('#input-minute').val()};
        if (! self.validate(inputs)) return self.showAlert('oh... フォーマット違う');
        var finish = Calc.convert2Epoch(inputs);
        self.model.add(self.identifier, finish);
        self.tracking.set(this.modelName, inputs);
        var message = Util.zP(2,inputs.hour) + ':' + Util.zP(2, inputs.minute)
            + "で" + self.purpose
            + "完了通知を登録しときました!";
        Util.presentation(message,{
            // ここでjsが死ぬんだよな多分
            callback : function(){ setTimeout(window.close, 100); },
            startOrFinish: 'start',
            sound: {
                kind: self.kind
            }
        });
    };
    ManualTimerView.prototype.cancel = function(){
        window.close();
    };
    ManualTimerView.prototype.validate = function(inputs){
        if (! inputs.hour.match(/^[0-9]+$/)) return false;
        if (! inputs.minute.match(/^[0-9]+$/)) return false;
        return true;
    };
    ManualTimerView.prototype.showAlert = function(message){
        window.alert(message);
    };

    // 以下テンプレート
    ManualTimerView.prototype.tpl = ''
    + '<div id="header" class="content">'
    + '    <div id="reminder-title">'
    + '        {{message}}'
    + '    </div>'
    + '</div>'
    + '<div id="main" class="content">'
    + '    <div id="time-input">'
    + '        <div id="table-wrapper">'
    + '            <div id="left-top-lack"></div>'
    + '            <table id="input-container">'
    + '                <tbody>'
    + '                    <tr class="caret-container">'
    + '                        <td><div target="hour"   class="hour up caret">&lt;</div></td>'
    + '                        <td></td>'
    + '                        <td><div target="minute" class="minute up caret">&lt;</div></td>'
    + '                        <td></td>'
    + '                    </tr>'
    + '                    <tr>'
    + '                        <td><input id="input-hour"   type="text" size="2" value="{{hour}}"></td>'
    + '                        <td>:</td>'
    + '                        <td><input id="input-minute" type="text" size="2" value="{{minute}}"></td>'
    + '                        <td>後</td>'
    + '                    </tr>'
    + '                    <tr class="caret-container">'
    + '                        <td><div target="hour"   class="hour down caret">&gt;</div></td>'
    + '                        <td></td>'
    + '                        <td><div target="minute" class="minute down caret">&gt;</div></td>'
    + '                        <td></td>'
    + '                    </tr>'
    + '                </tbody>'
    + '            </table>'
    + '            <div id="right-bottom-lack"></div>'
    + '        </div>'
    + '    </div>'
    + '</div>'
    + '<div id="footer" class="content">'
    + '    <button id="register-cancel" class="btn">今回はいいです</button><button id="register-commit" class="btn">登録</button>'
    + '</div>';
})();
