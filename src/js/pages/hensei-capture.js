/* global angular:false, window:false, chrome:false, document: false */
angular.module("kcw", []).controller("HenseiCapture", function($scope) {
  "use strict";

  $scope.ships = [];

  var detect = function(ok) {
    chrome.windows.getAll({populate:true}, function(wins) {
      if (!wins || wins.length === 0){
         return;
      }
      wins.forEach(function(win) {
        if (!win.tabs || win.tabs.length === 0) {
          return;
        }
        win.tabs.forEach(function(tab) {
          if (!tab || !tab.url) {
            return;
          }
          if (tab.url.match("http://osapi.dmm.com/gadgets/ifr")) {
            ok(win, tab);
          } else if (tab.url === "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/?widget=true") {
            ok(win, tab);
          }
        });
      });
    });
  };

  var defineCoords = function(img) {
    // aspect 800 * 480
    // if (img.width / img.height == 800 / 480) {
    return {
      x: img.width / 2.55,
      y: img.height / 5,
      w: img.width / 1.66,
      h: img.height / 1.285
    };
  };

  var trim = function(data) {
      var img = new window.Image();
      img.src = data;
      var c = defineCoords(img);
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = c.w/2;
      canvas.height = c.h/2;
      context.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, c.w/2, c.h/2);

      return canvas.toDataURL();
  };

  $scope.capture = function() {
    detect(function(win) {
      chrome.tabs.captureVisibleTab(win.id, {format:"png"}, function(data) {
        // window.open(data);
        var d = trim(data);
        $scope.addShip(d);
      });
    });
  };

  $scope.addShip = function(ship) {
    $scope.ships = $scope.ships.concat({src:ship, ts:Date.now()});
    $scope.$apply();
  };

  $scope.delete = function(index) {
    $scope.ships.splice(index, 1);
    // $scope.$apply();
  };

  var join = function(ss) {

    if (!ss || ss.length === 0) {
      return;
    }

    var first = new window.Image();
    first.src = ss[0].src;

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = (ss.length < 3) ? first.width * ss.length : first.width * 3;
    canvas.height = (ss.length > 3) ? first.height * 2 : first.height;

    // もういらない
    first = null;

    for (var i = 0; i < ss.length; i = i + 1) {
      var s = ss[i];
      var img = new window.Image();
      img.src = s.src;
      if (i < 3) {
        context.drawImage(
          img, // ソースはそのままの座標と大きさを採用
          img.width * i, // 流し込むX座標は、何番めかによる
          0              // 流し込むY座標はは、つねにてっぺん
        );
      } else {
        context.drawImage(
          img, // ソースはそのままの座標と大きさを採用
          img.width * (i%3), // 流し込むX座標は、何番めかによる
          img.height         // 流し込むY座標はは、つねに１列ぶん下
        );
      }
    }

    return canvas.toDataURL();
  };

  $scope.toCaptureWindow = function() {
    var uri = join($scope.ships);
    window.open(chrome.extension.getURL("src/html/capture.html") + "?uri=" + uri);
  };

  $scope.downloadNow = function() {
    var name = window.prompt("ファイル名を決めてほしいでござるー(o・∇・o)");
    var uri = join($scope.ships);
    var a = document.createElement("a");
    a.download = name + ".png";
    a.href = uri;
    a.click();
  };
});
