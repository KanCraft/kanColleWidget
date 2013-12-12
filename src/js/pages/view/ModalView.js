var widgetPages = widgetPages || {};

(function() {
    "use strict";
    var ModalView = widgetPages.ModalView = function(){};
    ModalView.prototype = Object.create(widgetPages.View.prototype);
    ModalView.prototype.constructor = ModalView;
    ModalView.prototype.render = function(){
        this.tpl = '<div></div>';
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
        //this.$el.hide().appendTo('body').fadeIn(100);
        this.$el.hide().appendTo('#page1').fadeIn(100);
    };
    /*
    ModalView.prototype.vanish = function(){
        this.$el.fadeOut(100, function(){
            $('#modal-wrapper').remove();
        });
    };
    */
    ModalView.prototype.cssAttrs = {
        '.modal' : {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            backgroundColor: 'black',
            color: '#eee',
            opacity: '0.9'
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
