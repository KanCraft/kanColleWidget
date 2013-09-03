var myStorage = new MyStorage();
(function(){
    initConfig();
    var config = myStorage.get('config');
    affectConfigInView(config);
    bindCloseAction();
    bindConfigChangedAction();
})();

function initConfig(){
    var initial_config = {
        'badge-left-time' : false,
        'record-achievements' : false
    };
    var config = myStorage.get('config') || initial_config;
    myStorage.set('config',config);
}
function affectConfigInView(config){
    for(var key in config){
        var input = document.getElementById(key);
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
            var config = myStorage.get('config');
            config[this.id] = this.checked;
            myStorage.set('config',config);
            console.log(myStorage.get('config'));
        });
    }
}
