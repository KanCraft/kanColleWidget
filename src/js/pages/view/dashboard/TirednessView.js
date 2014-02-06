var widgetPages = widgetPages || {};

(function() {
    var TirednessView = widgetPages.TirednessView = function(sortie) {
        this.sortie  = sortie;
        this.config = Config;
        this.sorties = new KanColleWidget.Sorties();
        this.tpl = '<tr>'
                 + '    <td>第{{deck_id}}艦隊</td>'
                 + '    <td>'
                 + '        <div class="tiredness-box boxy">'
                 + '            <div class="tiredness-bar {{color}}"></div>'
                 + '            <div class="tiredness-txt">{{message}}</div>'
                 + '        </div>'
                 + '    </td>'
                 + '</tr>';
        this.events = {
        };
        this.attrs = {
        };
    };
    Util.extend(TirednessView, widgetPages.View);
    TirednessView.prototype.render = function(){

        if (this.sortie.api_deck_id != 1 && this.sortie.finish == null) return $('');

        var bar = this._parseLeftTime(this.sortie.finish);
        var params = {
            deck_id : this.sortie.api_deck_id,
            color   : bar.color,
            message : bar.message
        };
        this.apply(params)._render();
        this.$el.find('.tiredness-bar').css({
            width: bar.width,
        }).text(this._time2Text(this.sortie.finish));
        return this.$el;
    };
    TirednessView.prototype._parseLeftTime = function(finishEpoch){
        var res = {
            color : 'green',
            width : '0%',
            message : '良好'
        };
        if (! finishEpoch) return res;

        var diffMinute = (finishEpoch - Date.now()) / (1000 * 60);
        var wholeMinutes = this.config.get("tiredness-recovery-minutes");
        res.width = Math.floor((diffMinute * 100)/wholeMinutes) + '%';
        if (diffMinute > (wholeMinutes*2)/3) {
            res.color = 'red';
        } else if (diffMinute > (wholeMinutes*1)/3) {
            res.color = 'yellow';
        }
        res.message = Math.floor(diffMinute) + '分';
        return res;
    };
    TirednessView.prototype._time2Text = function(finishEpoch){
        if (! finishEpoch) return '';
        var d = new Date(finishEpoch);
        return Util.zP(2,d.getHours()) + ':' + Util.zP(2,d.getMinutes());
    };
})();
