var widgetPages = widgetPages || {};

(function() {
  var MemoView = widgetPages.MemoView = function() {
      this.tpl = '<div class="contents">'
                +'    <h5>レシピメモ</h5>'
                +'    <div id="recipe-memo-container">'
                +'        <textarea>{{memoContents}}</textarea>'
                +'    </div>'
                +'</div>';
      this.parent = "div#recipe-memo-container";
      this.events = {
          "keyup #recipe-memo" : "saveRecipeMemo"
      };
  };
  MemoView.prototype = Object.create(widgetPages.View.prototype);
  MemoView.prototype.constructor = MemoView;
  MemoView.prototype.render = function(){
      var memo = new KanColleWidget.Memo();
      var params = {memoContents: memo.toJson().value };
      this.apply(params)._render().$el.find('textarea').attr({
          id : "recipe-memo",
          cols : "45",
          rows : "10",
          placeholder : "何かメモるの？いいけれど..."
      });
      return this.$el;
  };
  MemoView.prototype.saveRecipeMemo = function(ev) {
      var memo = new KanColleWidget.Memo();
      return memo.save($(ev.target).val());
  };
})();
