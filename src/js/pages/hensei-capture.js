/* global angular:false, window:false, chrome:false, document: false, $: false */
angular.module("kcw", []).controller("HenseiCapture", function($scope) {
  "use strict";

  $scope.ships = [];
  $scope.mode = "equipment";
  $scope.area = {
    x: 25, y: 25, w: 50, h: 50
  };

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

  $scope.modes = {
    equipment: {
      coords: function(img) {
        var max = 720, rate = (img.width > max) ? img.width / max : 1;
        return {
          x: img.width / 2.55,
          y: img.height / 5,
          w: img.width / 1.66,
          h: img.height / 1.285,
          r: rate
        };
      },
      col: 2, max: 6,
      description: "装備画面をキャプって2列3行のまとめ画像をつくります",
      title: "装備&編成キャプチャ",
      button: "この装備画面をキャプる"
    },
    shiplist: {
      coords: function(img) {
        var max = 720, rate = (img.width > max) ? img.width / max : 1;
        return {
          x: img.width / 2.2,
          y: img.height / 3.2,
          w: img.width / 1.85,
          h: img.height / 1.7,
          r: rate
        };
      },
      col: 1, max: 10,
      description: "編成の艦娘一覧画面をキャプって、1列のまとめ画像をつくります",
      title: "艦娘一覧キャプチャ",
      button: "この艦娘一覧ページをキャプる"
    },
    custom: {
      coords: function(img) {
        var max = 720, rate = (img.width > max) ? img.width / max : 1;
        return {
            x: img.width  * ($scope.area.x / 100),
            y: img.height * ($scope.area.y / 100),
            w: img.width  * ($scope.area.w / 100),
            h: img.height * ($scope.area.h / 100),
            r: rate
        };
      },
      col: 2, max: 100,// TODO: -1にする
      description: "自分で座標決めてください（なんかデカすぎたり枚数多すぎたりすると動かないんでそこんとこ注意）",
      title: "カスタムキャプチャ",
      button: "今の画面をキャプる"
    }
  };
  $scope.getMode = function() {
      return $scope.modes[$scope.mode] || $scope.modes.equipment;
  };

  var trim = function(data) {
      var img = new window.Image();
      img.src = data;
      var c = $scope.getMode().coords(img);
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

  /**
   * Aligner
   * 与えられた[]dataURIを、与えられたcol数で並べていく.
   * (col)列 x (src.length/col)行のマトリックスをつくる.
   */
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

    var aligner = new Aligner(ss, $scope.getMode().col);

    canvas.width = aligner.getSize().width;
    canvas.height = aligner.getSize().height;

    aligner.drawImage(context);

    return canvas.toDataURL();
  };

  var getDownloadDir = function() {
    var config = JSON.parse(window.localStorage.getItem('config') || '{}');
    return config['capture-image-download-dir'] || '艦これ';
  };

  $scope.toCaptureWindow = function() {
    var uri = join($scope.ships);
    window.open(chrome.extension.getURL("src/html/capture.html") + "?uri=" + uri);
  };

  $scope.downloadNow = function() {
    var dirname = getDownloadDir();
    var name = window.prompt("ファイル名を決めてほしいでござるー(o・∇・o)\n~/ダウンロード/" + dirname + "/") || "";
    name = name.trim();
    if (!name) {
      return window.alert("このファイル名はむり: 「" + name + "」");
    }
    var uri = join($scope.ships);
    chrome.downloads.download({
      url: uri,
      filename: dirname + "/" + name + ".png"
    });
  };

  $scope.modeChanged = function() {
    if ($scope.mode !== 'custom') {
      return;
    }
    detect(function(win) {
      chrome.tabs.captureVisibleTab(win.id, {format:"png"}, function(data) {
        $scope.sample = data;
        $scope.$apply();
        setTimeout(function(){
          var tgt = angular.element("#area-indicator");
          var wrap = angular.element("#coords-definer");
          tgt.on("dragleave", function(ev) {
              ev.stopPropagation();
              ev.preventDefault();
          });
          tgt.on("dragover", function(ev) {
              ev.stopPropagation();
              ev.preventDefault();
          });
          tgt.on("drop", function(ev) {
            $scope.area.x = Math.floor(100 * (ev.originalEvent.offsetX / wrap.width()));
            $scope.area.y = Math.floor(100 * (ev.originalEvent.offsetY / wrap.height()));
            $scope.$apply();
          });
        }, 0);
      });
    });
  };

  $scope.autoAdjust = function() {
    // TODO
  };
});

$(document).ready(function() {
  $("select").material_select();
});
