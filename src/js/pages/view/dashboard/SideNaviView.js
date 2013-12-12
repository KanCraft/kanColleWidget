var widgetPages = widgetPages || {};

(function() {
    var SideNaviView = widgetPages.SideNaviView = function() {
        this.tpl = '<div></div>';
        this.events = {
            'click .tag-contents' : 'showPage'
        };
        this.attrs = {
            id : 'side-navi'
        };
    };
    SideNaviView.prototype = Object.create(widgetPages.View.prototype);
    SideNaviView.prototype.constructor = SideNaviView;
    SideNaviView.prototype.render = function(){
        this.apply()._render();
        this.$el.append(
            $('<div class="navi-tag active"><div class="rotate90 tag-contents clickable" visible="page0">timer</div></div>'),
            $('<div class="navi-tag"><div class="rotate90 tag-contents clickable" visible="page1">quest</div></div>'),
            $('<div class="navi-tag"><div class="rotate90 tag-contents clickable" visible="page2">memo</div></div>')
        );
        return this.$el;
    };
    SideNaviView.adjustToSideNavi = function(){
        //alert("adjustToSideNave!!");
        //$('body').css({overflow:'hidden'});
        $('#wrapper').addClass('boxy').css({margin:0});
        $('#main').css({
            width: '390px',
            marginTop: 0,
            overflow: 'scroll'
        });
        //$('#page0').css({display:'none'});
        $('#page1').css({display:'none'});
        $('#page2').css({display:'none'});

        $('.list-title').remove();
        $('#tiredness-title').remove();
    };
    SideNaviView.prototype.showPage = function(ev, self){
        var pageId = '#' + $(ev.target).attr('visible');
        // init all
        $('.page').css({display: 'none'});
        $('.navi-tag').removeClass('active');

        $(pageId).css({display:''});
        $(ev.target).parent().addClass('active');
    };
})();
