angular.module("kcw", []).controller("StreamingCapture", function($scope) {
  "use strict";
  $scope.frames = [];
  $scope.duration = {
    start: {},
    end: {}
  };
  $scope.rec = {
    running: false,
    id: null,
    fps: 2
  };

  var tmpFrames = [];

  var search = {};
  (window.location.search || "").replace(/^\?/, "").split("&").forEach(function(fragment){
      var pair = fragment.split("=");
      if (pair.length === 2) search[pair[0]] = pair[1];
  });
  if (parseInt(search.fps) <= 32) $scope.rec.fps = parseInt(search.fps) || 2;
  var canvas = document.createElement("canvas");
  canvas.width = 680;
  canvas.height = 400;
  var context = canvas.getContext("2d");
  var v = document.getElementById("streaming-a");
  // var v = document.createElement("video");
  v.src = search.src;
  v.addEventListener("canplay", function() {
    if (search.autostart) $scope.startRec();
  });

  $scope.clickImage = function(uri, i) {
    $scope.start = {
      src: uri,
      idx: i
    };
  };

  $scope.clear = function() {
    $scope.frames = [];
    $scope.duration = {start:{}, end:{}};
    tmpFrames = [];
  };

  $scope.stopRec = function() {
    $scope.rec.running = false;
    setTimeout(function() {
      clearInterval($scope.rec.id);
      $scope.frames = tmpFrames;
    });
  };

  $scope.startRec = function() {
    $scope.rec.running = true;
    $scope.rec.id = setInterval(function() {
      context.drawImage(v, 0, 0, 680, 400);
      tmpFrames.push(canvas.toDataURL());
      /* 逐次表示してると遅い。アホかと
      setTimeout(function(){
        $scope.$apply();
      });
      */
    }, 1000 / ($scope.rec.fps || 2));
  };

  $scope.openCapture = function(uri) {
    Util.openCaptureByImageURI(uri);
  };

  $scope.generate = function() {
    var enc = new GIFEncoder();
    enc.setSize(680, 400);
    enc.setRepeat(0);
    enc.setDelay(1000/ ($scope.rec.fps || 2));
    enc.start();
    for (var i = $scope.duration.start.idx; i < $scope.duration.end.idx; i++) {
      var img = new Image();
      img.src = $scope.frames[i];
      context.drawImage(img, 0, 0);
      enc.addFrame(context);
    }
    enc.finish();

    // var url = 'data:image/gif;base64,'+encode64(enc.stream().getData());

    var binary = enc.stream().getData();
    var buffer = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    var blob = new Blob([buffer.buffer], {type:"image/gif"});
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = "unko" + ".gif";
    a.click();

    URL.revokeObjectURL(a.href);
  };

  angular.element("html").on("dragover dragleave", function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  });

  angular.element(".frame-dur-container").on("drop", function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var data = $(ev.originalEvent.dataTransfer.getData("text/html").replace(/^<[^>]+>/, ""));
    var dest = $(ev.target).attr("data-frame-target");
    $scope.duration[dest] = {
      src: data.attr("src"),
      idx: data.attr("data-idx")
    };
    $scope.$apply();
  });
});
