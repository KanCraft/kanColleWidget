(function(){
    var src = null;
    setTimeout(function(){
        var embed = document.getElementById('externalswf');
        if(embed) src = embed.getAttribute('src');
        if(src){
            var conf_list = {"l": 1200,"m": 800,"s": 600,"xs": 400};
            var mode = parse(window.location.search)['mode'];
            var width = conf_list[mode];
            var height= width*0.6;
            var w1 = window;
            var w2 = window.open(src, "_blank", "width="+width+",height="+height+",menubar=no,status=no,scrollbars=no,resizable=no,left=40,top=40");
            w1.close();
        }
    },1000);
})();

