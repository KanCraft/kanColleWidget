var myStorage = new MyStorage();
(function() {
	initConfig();
	var config = myStorage.get('config');
	affectConfigInView(config);
	bindCloseAction();
	bindConfigChangedAction();
	bindConfigClickAction();
})();

function initConfig() {
	var initial_config = {
		'alert-campaign' : true,
		'play-sound-at-alert' : false,
		'file-sound-at-alert' : "",
		'volume-sound-at-alert' : "100",
		'disp-image-at-alert' : false,
		'file-image-at-alert' : "",
		'badge-left-time' : false,
		'record-achievements' : false
	};
	var config = myStorage.get('config') || initial_config;
	for( var key in initial_config ){
		if( config[key] == undefined ){
			config[key] = initial_config[key];
		}
	}
	myStorage.set('config', config);
}

function affectConfigInView(config) {
	var inputs = document.getElementsByTagName('input');
	for( var i=0, len=inputs.length; i<len; i++){
		var input = inputs[i];
		var key = input.id;
		if( config[key] ){
			if (input.files) {
				// ファイルならなにもしない
			} else if (input.checked != undefined && typeof config[key] == 'boolean') {
				// チェックボックスなら
				input.checked = config[key];
			} else if (input.value != undefined) {
				// チェックボックス以外
				input.value = config[key];
				if( key == 'volume-sound-at-alert' ){
					document.getElementById('text-volume-sound-at-alert').innerHTML = config[key];
				}
			}
		}
	}
}

function bindCloseAction() {
	document.getElementById('close-config').addEventListener('click', function() {
		window.close();
	});
}

function bindConfigChangedAction() {
	var inputs = document.getElementsByTagName('input');
	for( var i=0, len=inputs.length; i<len; i++){
		inputs[i].addEventListener('change', function(){
			var config = myStorage.get('config');
			if (this.files) {
				// ファイルなら
				if( writeLocalFile(this.files[0], this.id, this.accept) ){
					config[this.id] = this.files[0].name;
					document.getElementById(this.id).value = this.files[0].name;
					if( this.id == 'file-image-at-alert' ){
						readFile( this.files[0].name, function(file){
							var url = window.URL.createObjectURL(file);
							document.getElementById('image-at-alert').src = url;
							var params = {
								type: "basic",
								title: "通知サンプル",
								message: "通知のサンプルですよ",
								iconUrl: url
							};
							chrome.notifications.create(String((new Date()).getTime()), params, function(){/* do nothing */});
						});
					}
				};
			} else if (this.checked != undefined && typeof config[this.id] == 'boolean') {
				// チェックボックスなら
				config[this.id] = this.checked;
			} else if (this.value != undefined) {
				// チェックボックス以外
				config[this.id] = this.value;
				if( this.id == 'volume-sound-at-alert' ){
					document.getElementById('text-volume-sound-at-alert').innerHTML = this.value;
				}
			}
			myStorage.set('config', config);
		});
	}
}

function bindConfigClickAction() {
	var buttons = document.getElementsByTagName('button');
	for( var i=0, len=buttons.length; i<len; i++){
		buttons[i].addEventListener('click', function(){
			if( this.id == "button-sound-at-alert" ){
				var config = myStorage.get('config');
				if( config['play-sound-at-alert'] && config['file-sound-at-alert']){
					readFile( config['file-sound-at-alert'], function(file){
						var url = window.URL.createObjectURL(file);
						var audio = new Audio(url);
						audio.volume = config['volume-sound-at-alert']/100.0;
						audio.play();
					});
				}
			}
		});
	}
}
