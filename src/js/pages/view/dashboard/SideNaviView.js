var widgetPages = widgetPages || {};

(function() {
    var SideNaviView = widgetPages.SideNaviView = function() {
        this.tpl = '<div></div>';
        this.events = {
            'click .navi-tab' : 'showPage'
        };
        this.attrs = {
            id : 'side-navi'
        };
    };
    Util.extend(SideNaviView, widgetPages.View);
    SideNaviView.prototype.render = function(){
        this.apply()._render();
        this.$el.append(
            $('<div class="navi-tab active" visible="page0"><div class="rotate90 tab-contents">timer</div></div>'),
            $('<div class="navi-tab" visible="page1"><div class="rotate90 tab-contents">quest</div></div>'),
            $('<div class="navi-tab" visible="page2"><div class="rotate90 tab-contents">memo</div></div>')
        );
        return this.$el;
    };
    SideNaviView.adjustToSideNavi = function(){
        $('#wrapper').addClass('boxy').css({margin:0});
        $('#main').css({
            width: '390px',
            marginTop: 0,
            overflow: 'auto'
        });
        $('#page1').css({display:'none'});
        $('#page2').css({display:'none'});

        $('#tiredness-title').remove();
    };
    SideNaviView.prototype.showPage = function(ev, self){
        var pageId = '#' + $(ev.currentTarget).attr('visible');
        // init all
        $('.page').css({display: 'none'});
        $('.navi-tab').removeClass('active');

        $(ev.currentTarget).addClass('active');
        $(pageId).css({display:''});
    };
})();
