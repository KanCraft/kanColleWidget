(function(){
    var body = document.getElementsByTagName('body').item().style.zoom = getZoom();
    var wrapper = document.getElementById('flashWrap');
    wrapper.style.margin = 0;
    setTimeout(function(){
        document.getElementById('sectionWrap').style.display = 'none';
    },1000);
})();

/* mode: string */function getZoom(){
    var mapWidthZoom = {
        '1200': '1.5',
        '800' : '1',
        '600' : '0.75',
        '400' : '0.5'
    }
    return mapWidthZoom[window.innerWidth];
}