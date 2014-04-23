var widgetPages = widgetPages || {};

(function() {
    "use strict";
    var ModalView = widgetPages.ModalView = function($inner){
        this.$inner = $inner;
    };
    Util.extend(ModalView, widgetPages.View);
    ModalView.prototype.render = function(){
        this.tpl = '<div><div id="modal-background"></div></div>';
        this.attrs = {
            id : "modal-wrapper",
            class : "modal"
        };
        this.apply()._render();
        // hidden in default
        this.$el.append(this.$inner);
        this.$el.css({display:'none'});
        return this;
    };
    ModalView.prototype.show = function(){
        for(var selector in this.cssAttrs){
            this.$el.find(selector).css(this.cssAttrs[selector]);
        }
        this.$el.css(this.cssAttrs['.modal']);
        this.$el.hide().appendTo('body').fadeIn(100);
        //this.$el.hide().appendTo('#page1').fadeIn(100);
    };
    ModalView/*.prototype*/.vanish = function(){
        $('#modal-wrapper').fadeOut(100,function(){
            $(this).remove();
        });
    };
    ModalView.prototype.cssAttrs = {
        '.modal' : {
            position: 'fixed',
            margin: 0,
            top: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            color: '#eee'
        },
        '.modal-contents' : {
            position: 'relative',
            width: '90%',
            margin: '20px auto',
        },
        '.modal-footer' :{
            width: '100%',
        },
        '.modal-footer>.boxy' : {
            width: '100%'
        }
    };
})();
