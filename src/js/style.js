(function(){
    var params = {};
    window.location.search.substr(1).split('&').map(function(val){
        if(val.match('=')){
            var k_v = val.split('=');
            params[k_v[0]] = k_v[1];
        }
    });
    var zoom;
    var styles = {};
    switch(params['mode']){
        case 'l':
            zoom = 2;
            break;
        case 'm':
            zoom = 1;
            break;
        case 's':
            zoom = 0.75;
            break;
        case 'xs':
            zoom = 0.5;
            break;
        default:
            alert('ほげ');
    }
    // document.body.style.webkitTransform = 'scale(' + zoom + ')';
    // これをやるとFlashの位置情報が狂うので今の所使わない
    var target = document.getElementsByTagName('iframe').item();
    target.style.position = 'fixed';
    target.style.top = '-16px';
    target.style.left = '-50px';
    target.style.zIndex = '2';
    document.getElementsByTagName('body').item().style.overflow = 'hidden';
})();