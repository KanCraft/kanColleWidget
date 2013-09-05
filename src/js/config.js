var myStorage = new MyStorage();
(function() {
	initConfig();
	var config = myStorage.get('config');
	affectConfigInView(config);
	bindCloseAction();
	bindConfigChangedAction();
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
	// var config = initial_config;
	var config = myStorage.get('config') || initial_config;
	myStorage.set('config', config);
}
function affectConfigInView(config) {
	for ( var key in config) {
		var input = document.getElementById(key);
		if (input) {
			if (input.files) {
				// ファイルなら
				input.files[0] = config[key];
			} else if (input.checked != undefined
					&& typeof config[key] == 'boolean') {
				// チェックボックスなら
				input.checked = config[key];
			} else if (input.value != undefined) {
				// チェックボックス以外
				input.value = config[key];
			}
		}
	}
}
function bindCloseAction() {
	document.getElementById('close-config').addEventListener('click',
			function() {
				window.close();
			});
}
function bindConfigChangedAction() {
	var inputs = document.getElementsByTagName('input');
	for ( var i = 0, len = inputs.length; i < len; i++) {
		inputs[i].addEventListener('change', function() {
			var config = myStorage.get('config');
			if (this.files) {
				// ファイルなら
				config[this.id] = this.files[0];
			} else if (this.checked != undefined
					&& typeof config[this.id] == 'boolean') {
				// チェックボックスなら
				config[this.id] = this.checked;
			} else if (this.value != undefined) {
				// チェックボックス以外
				config[this.id] = this.value;
			}
			myStorage.set('config', config);
		});
	}
}
