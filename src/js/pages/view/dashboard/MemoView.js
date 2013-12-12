var widgetPages = widgetPages || {};

(function() {
  var MemoView = widgetPages.MemoView = function() {
      this.tpl = '<textarea>{{memoContents}}</textarea>';
      this.parent = "div#recipe-memo-container";
      this.events = {
          "keyup #recipe-memo" : "saveRecipeMemo"
      };
      this.attrs = {
          id : "recipe-memo",
          cols : "45",
          rows : "10",
          placeholder : "何かメモるの？いいけれど..."
      };
  };
  MemoView.prototype = Object.create(widgetPages.View.prototype);
  MemoView.prototype.constructor = MemoView;
  MemoView.prototype.render = function(){
      var memo = new KanColleWidget.Memo();
      var params = {memoContents: memo.toJson().value };
      return this.apply(params)._render().$el;
  };
  MemoView.prototype.saveRecipeMemo = function(ev) {
      var memo = new KanColleWidget.Memo();
      return memo.save($(ev.target).val());
  };
})();
