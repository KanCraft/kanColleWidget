var SIZE_LIMIT = 1024 * 1024 * 5; // 5MB
var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

function onFileError(error){
	console.log("File Error: "+ error.code);
	for ( var key in error){
		console.log(key + "=" + error[key]);
	}
}

function readFile(fileName, callbackFunc){
	console.log("readFile: " + fileName);
	requestFileSystem(PERSISTENT, SIZE_LIMIT, function(fileSystem){
		fileSystem.root.getFile(fileName, {}, function(fileEntry){
			fileEntry.file(function(file){
				var reader = new FileReader();
				reader.onloadend = function(event){
					console.log("read completed. "+ fileEntry.toURL());
					if( callbackFunc ){
						callbackFunc(fileEntry);
					}
				};
				reader.onerror = function(error){
					alert("read failed : " + error);
				};
				reader.readAsBinaryString(file);
			}, onFileError);
		}, onFileError);
	}, onFileError);
}

function writeFile(file, callbackFunc) {
	console.log("writeFile " + file.name);
	requestFileSystem(PERSISTENT, SIZE_LIMIT, function(fileSystem){
		console.log("writeFile: initFileSystem");
		fileSystem.root.getFile(file.name, { create: true, exclusive: false }, function(fileEntry){
			fileEntry.createWriter(function(fileWriter){
				fileWriter.onwriteend = function(event){
					console.log("write completed. " + fileEntry.toURL());
					if( callbackFunc ){
						callbackFunc(fileEntry);
					}
				};
				fileWriter.onerror = function(error){
					alert("write failed : " + error);
				};
				fileWriter.write(file);
			}, onFileError);
		}, onFileError);
	}, onFileError);
	return true;
}

function deleteFile(file){
	console.log("deleteFile " + file.name);
	requestFileSystem(PERSISTENT, SIZE_LIMIT, function(fileSystem){
		console.log("deleteFile: initFileSystem");
		fileSystem.root.getFile(file.name, { create: false }, function(fileEntry){
			fileEntry.remove(function(){
				console.log("delete completed. " + fileEntry.toURL());
			}, onFileError);
		}, onFileError);
	}, onFileError);
}

function writeLocalFile(file, accept, callbackFunc){
	console.log("writeLocalFile: " + file.name);
	for( var key in file ){
		console.log(key + "=" + file[key]);
	}
	if( !file.type.match(accept) ){
		alert("ファイル種別が違います");
		return false;
	}
	if( file.size > SIZE_LIMIT ){
		alert("ファイルサイズが大きすぎます。"+SIZE_LIMIT/(1024*1024)+"MB未満のファイルにしてください。");
		return false;
	}
	return writeFile(file, callbackFunc);
}
