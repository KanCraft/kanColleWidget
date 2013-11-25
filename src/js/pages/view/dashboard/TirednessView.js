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
    TirednessView.prototype = Object.create(widgetPages.View.prototype);
    TirednessView.prototype.constructor = TirednessView;
    TirednessView.prototype.render = function(){
        var bar = this._parseLeftTime(this.sortie.finish);
        var params = {
            deck_id : this.sortie.api_deck_id,
            color   : bar.color,
            message : bar.message
        };
        this.apply(params)._render();
        this.$el.find('.tiredness-bar').css({
            width: bar.width,
        })
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
})();
