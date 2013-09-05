var SIZE_LIMIT = 1024 * 1024 * 5; // 5MB

function readWriteFile(file, id) {
	console.log("readWriteFile: " + file + "," + id);
	for ( var key in file) {
		console.log(key + "=" + file[key]);
	}

	if (file.size > SIZE_LIMIT) {
		alert("ファイルサイズが大きすぎます。5MB未満のファイルにしてください。");
	} else {
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			console.log("name=" + theFile.name);
			console.log("type=" + theFile.type);
			return function(event) {
				writeFile(id, theFile.type, event);
			};
		})(file);
		reader.readAsDataURL(file);
	}
}

function getOnReadCallback(fileName, fileType) {
}

function writeFile(fileName, fileType, readerEvent) {
	console.log("writeFile " + fileName);
	console.log("fileType " + fileType);
	console.log("readerEvent " + readerEvent);

	var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	requestFileSystem(PERSISTENT, SIZE_LIMIT, function(fileSystem) {
		fileSystem.root.getFile(fileName, { create : true }, function(fileEntry) {
			console.log(fileEntry.toURL());
			fileEntry.createWriter(function(fileWriter) {
				blob = new Blob([readerEvent.target.result], {type:fileType});
				fileWriter.onwrite = function(entry) {
					console.log("writing. " + entry);
				};
				fileWriter.onwriteend = function(entry) {
					console.log("write completed. " + fileEntry.toURL());
				};
				fileWriter.onerror = function(error) {
					alert("write failed : " + error);
				};
				fileWriter.write(blob);
			}, onFileError);
		}, onFileError);
	});
}

function onFileError(error) {
	console.log("Error occured. " + error);
	for ( var key in error) {
		console.log(key + "=" + error[key]);
	}
}
