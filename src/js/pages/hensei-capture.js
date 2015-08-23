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
    var max = 720;
    var rate = (img.width > max) ? img.width / max : 1;

    return {
      x: img.width / 2.55,
      y: img.height / 5,
      w: img.width / 1.66,
      h: img.height / 1.285,
      r: rate
    };
  };

  var trim = function(data) {
      var img = new window.Image();
      img.src = data;
      var c = defineCoords(img);
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");

      canvas.width = c.w/c.r;
      canvas.height = c.h/c.r;
      context.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, c.w/c.r, c.h/c.r);

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

  var Aligner = function(src, col) {
    this.cell = (function(s) { var img = new window.Image(); img.src = s.src; return img; })(src[0]);
    this.col = col || 2;
    this.matrix = [];
    src.forEach(function(s, i) {
      var r = Math.floor(i / this.col);
      var c = i % this.col;
      this.matrix[r] = this.matrix[r] || [];
      this.matrix[r][c] = s;
    }.bind(this));

    this.getSize = function() {
      return {
        width: this.cell.width * this.matrix[0].length,
        height: this.cell.height * this.matrix.length
      };
    };

    this.drawImage = function(context) {
      for (var i = 0; i < this.matrix.length; i++) {
        for (var j = 0; j < this.matrix[i].length; j++) {
          var img = new window.Image(); img.src = this.matrix[i][j].src;
          context.drawImage(
            img,
            this.cell.width * j,
            this.cell.height * i
          );
        }
      }
      return context;
    };
  };

  var join = function(ss) {

    if (!ss || ss.length === 0) {
      return;
    }

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    var aligner = new Aligner(ss, 2);

    canvas.width = aligner.getSize().width;
    canvas.height = aligner.getSize().height;

    aligner.drawImage(context);

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
