/* global window:false, KanColleWidget:false, chrome:false, $:false, angular:false, Util:global */
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
  $scope.progress = {
    running: false,
    percent: 0
  };

  var tmpFrames = [];

  var search = {
    src: null, // streaming src
    fps: 2, // frame per second
    autostart: false, // auto start to record
    observe: false // output successively
  };
  (window.location.search || "").replace(/^\?/, "").split("&").forEach(function(fragment){
      var pair = fragment.split("=");
      if (pair.length === 2) {
        search[pair[0]] = pair[1];
      }
  });
  if (parseInt(search.fps) <= 32) {
    $scope.rec.fps = parseInt(search.fps) || 2;
  }
  var canvas = window.document.createElement("canvas");
  canvas.width = 680;
  canvas.height = 400;
  var context = canvas.getContext("2d");
  var v = window.document.getElementById("streaming-a");
  // var v = document.createElement("video");
  v.src = search.src;
  v.addEventListener("canplay", function() {
    if (search.autostart) {
      $scope.startRec();
    }
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
    $scope.rec.previewing = true;
    window.setTimeout(function() {
      window.clearInterval($scope.rec.id);
      $scope.$apply(function() {
        $scope.frames = tmpFrames;
        $scope.rec.previewing = false;
      });
    }, 10);
  };

  $scope.startRec = function() {
    $scope.rec.running = true;
    $scope.rec.id = window.setInterval(function() {
      context.drawImage(v, 0, 0, 680, 400);
      tmpFrames.push(canvas.toDataURL());
      if (search.observe) {
        window.setTimeout(function() {
          $scope.$apply(function() {
            $scope.frames = tmpFrames;
          });
        });
      }
    }, 1000 / ($scope.rec.fps || 2));
  };

  $scope.openCapture = function(uri) {
    Util.openCaptureByImageURI(uri);
  };

  $scope.generate = function() {
    $scope.progress.running = true;
    var worker = new window.Worker("../js/worker/gif-encode-worker.js");
    var length = $scope.duration.end.idx - $scope.duration.start.idx;
    worker.addEventListener("message", function(ev) {
      var data = ev.data;
      switch (data.message) {
      case "progress":
        $scope.$apply(function() {
          $scope.progress.percent = Math.floor(100 * (data.count / length));
        });
        break;
      case "done":
        var binary = data.binary;
        $scope.progress.running = false;
        $scope.progress.percent = 0;

        var uri = encode64(binary)
        /*
        var blob = new window.Blob([buffer.buffer], {type:"image/gif"});
        var url = window.URL.createObjectURL(blob);
        */
        $scope.$apply(function() {
          $scope.result = {uri: "data:image/gif;base64," + uri};
          // まあとりあえず
          window.setTimeout(function(){
            $("ul.tabs").tabs();
          });
        });
        /*
        chrome.tabs.create({
          url: chrome.extension.getURL("/") + "src/html/gif-result.html"
              + "?uri=" + "data:image/gif;base64," + window.encodeURIComponent(uri)
        });
        */
        break;
      }
    });

    worker.postMessage({cmd:"start", params:{fps: $scope.rec.fps || 2}});

    var frames = $scope.frames.slice(
      $scope.duration.start.idx, $scope.duration.end.idx + 1
    );
    frames.forEach(function(frame) {
      var img = new window.Image();
      img.src = frame;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      var u8a = context.getImageData(0, 0, canvas.width, canvas.height).data;
      worker.postMessage({cmd:"frame", frame: u8a});
    });

    window.setTimeout(function(){
      worker.postMessage({cmd:"over"});
    });
    return;
  };

  $scope.tweet = function() {
    var confirmed = window.confirm($scope.tweettext + "\n\nで、ツイートする？");
    if (!confirmed) {
      return;
    }
    $scope.tweeting = true;
    var twitter = new KanColleWidget.ServiceTwitter();
    twitter.tweetWithImageURI($scope.result.uri, "gif", $scope.tweettext).done(function(res) {
      $scope.$apply(function() {
        $scope.destPermalink = KanColleWidget.ServiceTwitter.getPermalinkFromSuccessResponse(res);
        $scope.tweeting = false;
      });
    }).fail(function(err) {
      var message = "Twitter先生からエラーのお知らせのようです\n" + JSON.stringify(err);
      window.alert(message);
      $scope.tweeting = false;
    });
  };

  $scope.download = function() {
    var getDownloadDir = function() {
      var config = JSON.parse(window.localStorage.getItem("config") || "{}");
      return config["capture-image-download-dir"] || "艦これ";
    };
    chrome.downloads.download({
      url: $scope.result.uri,
      filename: getDownloadDir() + "/" + $scope.filename + ".gif"
    });
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
