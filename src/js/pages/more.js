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
        if(typeof config[key] == 'string'){
            input.value = config[key];
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
        console.log(inputs[i]);
        console.log(inputs[i].type);
        if(inputs[i].type == 'checkbox'){
            inputs[i].addEventListener('change',function(){
                Config.set(this.id, this.checked);
            });
        }
        if(inputs[i].type == 'text'){
            inputs[i].addEventListener('keydown',function(){
                Config.set(this.id, this.value);
            });
        }
    }
}
