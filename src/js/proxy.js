(function(){
    var ifrm_url = document.getElementsByTagName('iframe').item().getAttribute('src');
    var conf_list = {"l": 1200,"m": 800,"s": 600,"xs": 400};
    var mode = parse(window.location.search)['mode'];
    var width = conf_list[mode];
    var height= width*0.6;
    //ifrm_url = ifrm_url + '&mode=' + mode;
    var w1 = window;
    var w2 = window.open(ifrm_url, "_blank", "titile=しごとしろ,width="+width+",height="+height+",menubar=no,status=no,scrollbars=no,resizable=no,left=40,top=40");
    w1.close();
})();
