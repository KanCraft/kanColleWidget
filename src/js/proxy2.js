(function(){
    var src = null;
    setTimeout(function(){
        var embed = document.getElementById('externalswf');
        if(embed) src = embed.getAttribute('src');
        if(src){
            var conf_list = {"l": 1200,"m": 800,"s": 600,"xs": 400};
            var mode = getMode();
            var width = parseInt(conf_list[mode]);
            var height= width*0.6;
            var w1 = window;
            var w2 = window.open(src, "_blank", "width="+width+",height="+height+",menubar=no,status=no,scrollbars=no,resizable=no,left=40,top=40");
            w1.close();
        }else{
            alert("ウィジェット化に失敗しました。が、ふつうにプレーできます。");
        }
    },1000);
})();
