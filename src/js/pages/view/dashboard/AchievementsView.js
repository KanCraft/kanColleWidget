var widgetPages = widgetPages || {};

(function() {
    var AchievementsView = widgetPages.AchievementsView = function(achievements) {
        this.tpl = '<div class="box-30">'
                  +'  <h5>提督任務実績</h5>'
                  +'  <table border="0" class="table" id="achievements-table">'
                  +'    <tbody>'
                  +'      <tr><td></td><td>本日</td><td>今週</td></tr>'
                  +'      <tr>'
                  +'        <td>補給</td>'
                  +'        <td>{{daily_hokyu_count}}</td>'
                  +'        <td>{{weekly_hokyu_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>遠征</td>'
                  +'        <td>{{daily_mission_count}}</td>'
                  +'        <td>{{weekly_mission_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>出撃</td>'
                  +'        <td>{{daily_map_count}}</td>'
                  +'        <td>{{weekly_map_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>開発</td>'
                  +'        <td>{{daily_createitem_count}}</td>'
                  +'        <td>{{weekly_createitem_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>廃棄</td>'
                  +'        <td>{{daily_destroyitem_count}}</td>'
                  +'        <td>{{weekly_destroyitem_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>建造</td>'
                  +'        <td>{{daily_createship_count}}</td>'
                  +'        <td>{{weekly_createship_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>演習</td>'
                  +'        <td>{{daily_practice_count}}</td>'
                  +'        <td>{{weekly_practice_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>入渠</td>'
                  +'        <td>{{daily_nyukyo_count}}</td>'
                  +'        <td>{{weekly_nyukyo_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>近改</td>'
                  +'        <td>{{daily_kaisou_count}}</td>'
                  +'        <td>{{weekly_kaisou_count}}</td>'
                  +'      </tr>'
                  +'      <tr>'
                  +'        <td>改工</td>'
                  +'        <td>{{daily_remodel_count}}</td>'
                  +'        <td>{{weekly_remodel_count}}</td>'
                  +'      </tr>'
                  +'    </tbody>'
                  +'  </table>'
                  +'</div>';
        if (!Config.get('record-achievements')) {
          this.tpl = '<div class="box-30"></div>';
        }
        this.achievements = achievements;
    };
    Util.extend(AchievementsView, widgetPages.View);
    AchievementsView.prototype.render = function(){
      this.apply(this.achievements.toFlatJson())._render();
      return this.$el;
    };
    AchievementsView.prototype.update = function() {
      // まあしょうがないよね
      var $el = new AchievementsView(this.achievements).render();
      this.$el.html('').append($el.html());
    };
})();
