(function(){
    affectConfigInView();
    bindCloseAction();
    bindConfigChangedAction();
})();

function affectConfigInView(){
    var config = Config.getJSON();
    for(var key in config){
        var input = document.getElementById(key);
        if(input == null) continue;
        if(typeof config[key] == 'boolean'){
            input.checked = config[key];
        }
    }
}
function bindCloseAction(){
    document.getElementById('close-config').addEventListener('click', function(){
        window.close();
    });
}
function bindConfigChangedAction(){
    var inputs = document.getElementsByTagName('input');
    for(var i= 0,len=inputs.length;i<len;i++){
        inputs[i].addEventListener('change',function(){
            Config.set(this.id, this.checked);
        });
    }
}
