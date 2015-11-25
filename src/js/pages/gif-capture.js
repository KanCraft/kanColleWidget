/* global window:false, KanColleWidget:false, chrome:false, $:false, angular:false, Util:global, encode64:false */
angular.module("kcw", []).filter("humanize", function() {
  var trunc = function(s, delim, sig) {
    s = String(s);
    delim = delim || ".", sig = sig || 2;
    var parts = s.split(delim);
    if (parts.length < 2) return parts[0];
    return [parts[0], parts[1].slice(0, sig)].join(delim);
  };
  var div = 1000;
  return function(input) {
    var fl = parseFloat(input);
    if (input != fl) return input;
    if (fl > Math.pow(div, 3)) {
      return trunc(fl / Math.pow(div, 3)) + "GB";
    }
    if (fl > Math.pow(div, 2)) {
      return trunc(fl / Math.pow(div, 2)) + "MB";
    }
    if (fl > Math.pow(div, 1)) {
      return trunc(fl / Math.pow(div, 1)) + "KB";
    }
    return fl + "B"
  };
}).controller("StreamingCapture", function($scope) {
  "use strict";
  $scope.frames = [];
  $scope.duration = {
    start: {},
    end: {},
    estimated: {}
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
  $scope.observe = search.observe;
  if (parseInt(search.fps) <= 32) {
    $scope.rec.fps = parseInt(search.fps) || 2;
  }
  var canvas = window.document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 240;
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
    if (!window.confirm("フレームとGIFけっかを全てクリアします")) return;
    $scope.frames = [];
    $scope.duration = {start:{}, end:{}, estimated: {}};
    tmpFrames = [];
    $scope.result = {};
  };

  var fired = null;

  $scope.stopRec = function() {
    window.clearInterval($scope.rec.id);
    $scope.rec.running = false;
    var timer = document.getElementById("timer");
    timer.innerHTML = "processing";
    $scope.rec.previewing = true;
    fired = null;
    window.setTimeout(function() {
      // timer.innerHTML = "";
      $scope.rec.previewing = false;
      $scope.frames = tmpFrames;
      $scope.$apply();
    }, 10);
  };

  var elapsed = function(fr, to) {
    var diff = (to - fr) / 1000;
    return Math.floor(diff) + "sec";
  };

  $scope.startRec = function() {
    $scope.rec.running = true;
    fired = Date.now();
    var timer = document.getElementById("timer");
    $scope.rec.id = window.setInterval(function() {
      var now = Date.now();
      timer.innerHTML = elapsed(fired, now);
      if (!search.observe && now - fired > 1000 * 12) {
        return $scope.stopRec();
      }
      context.drawImage(v, 0, 0, 400, 240);
      tmpFrames.push(canvas.toDataURL());
      if (search.observe) {
        $scope.$apply(function() {
          $scope.frames = tmpFrames.slice(-20).reverse();
        });
      }
    }, 1000 / ($scope.rec.fps || 2));
  };

  $scope.openCapture = function(uri) {
    Util.openCaptureByImageURI(uri);
  };

  $scope.generate = function() {
    var length = $scope.duration.end.idx - $scope.duration.start.idx;
    /*
    if (length > 120) {
      window.alert("120フレームくらいにしてください");
      return;
    }
    */
    var worker = new window.Worker("../js/worker/gif-encode-worker.js");
    $scope.progress.running = true;
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

        var uri = encode64(binary);
        /*
        var blob = new window.Blob([buffer.buffer], {type:"image/gif"});
        var url = window.URL.createObjectURL(blob);
        */
        $scope.$apply(function() {
          $scope.result = {
            uri: "data:image/gif;base64," + uri,
            size: getSizeFromBase64(uri)
          };
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
      $scope.duration.start.idx, $scope.duration.end.idx
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

  var getSizeFromBase64 = function(b64str, dohumanize) {
    return (b64str || "").length * 3 / 4;
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
      idx: data.attr("data-idx"),
      fsize: getSizeFromBase64(data.attr("src"))
    };

    if ($scope.duration.end.idx - $scope.duration.start.idx > 0) {
      var fsize = $scope.duration[dest].fsize;
      var len = $scope.duration.end.idx - $scope.duration.start.idx;
      $scope.duration.estimated.fsize = fsize * len;
    }

    $scope.$apply();
  });
});
