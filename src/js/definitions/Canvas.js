var KanColleWidget = KanColleWidget || {};

(function(){
    var Canvas = KanColleWidget.Canvas = function(canvasId, contextName) {
        this.canvasId = canvasId || 'canvas';
        this.contextName = contextName || '2d';
        this.canvas = document.getElementById(this.canvasId);
        this.context = this.canvas.getContext(this.contextName);

        this.isMouseDown = false;
        this.start = null;
        this.end   = null;

        this.storedImageData = null;

        this.tool = {};// Interface DrawingMethod
    };
    Canvas.initWithURI = function(imgURI, opt) {
        opt = opt || {};
        var _self = new Canvas(opt.canvasId, opt.contextName);
        var _img = new Image();
        _img.src = imgURI;
        _self.canvas.setAttribute('width', _img.width);
        _self.canvas.setAttribute('height', _img.height);
        _self.context.drawImage(_img, 0, 0);
        return _self;
    };
    Canvas.Rect = {
        onStart: function(ev, self){
            // 今の状態を保存
            self.storedImageData = self.context.getImageData(0,0,self.canvas.width,self.canvas.height);

            // 始点を記憶
            self.start = {x: ev.offsetX,y: ev.offsetY};
        },
        onMove : function(ev, self){
            // 保存した最初の状態に復帰
            self.context.putImageData(self.storedImageData,0,0);
            // 終点座標の更新
            self.end = {x: ev.offsetX, y: ev.offsetY};
            // 描画
            Canvas.Rect.onFinish(ev, self);
        },
        onFinish : function(ev, self){
            // 終点座標を確定
            self.end = {x: ev.offsetX,y: ev.offsetY};
            self.context.fillRect(
                self.start.x,
                self.start.y,
                self.end.x - self.start.x,
                self.end.y - self.start.y
            );
        }
    };
    Canvas.Curve = {
        _prot : function(ev, self) {
            // プロットする
            self.context.beginPath();
            self.context.arc(
                ev.offsetX,
                ev.offsetY,
                5,
                0,2*Math.PI
            );
            self.context.fill();
        },
        onStart : function(ev, self){
            Canvas.Curve._prot(ev,self);
        },
        onMove : function(ev, self){
            Canvas.Curve._prot(ev,self);
        },
        onFinish : function(ev, self){
        }
    };
    Canvas.prototype.init = function() {
        this.start = null;
        this.end   = null;
    };
    Canvas.prototype.listen = function() {
        this.delegateMouseMove();
        this.delegateMouseDown();
        this.delegateMouseUp();
    };
    Canvas.prototype.delegateMouseMove = function() {
        var self = this;
        $(this.canvas).on('mousemove', function(ev){
            self.update(ev, self);
        });
    };
    Canvas.prototype.delegateMouseDown = function() {
        var self = this;
        $(this.canvas).on('mousedown', function(ev){
            self.startDrawing(ev, self);
        });
    };
    Canvas.prototype.delegateMouseUp = function() {
        var self = this;
        $(this.canvas).on('mouseup',function(ev){
            self.finishDrawing(ev, self);
        });
    };
    Canvas.prototype.update = function(ev, self) {
        // 押下していない場合は終了する
        if (! self.isMouseDown) return;
        // 移動
        self.tool.onMove(ev, self);
    };
    Canvas.prototype.startDrawing = function(ev, self) {
        // マウス押下状態を記憶
        self.isMouseDown = true;
        // メソッドの指定
        var toolName = $(':radio[name="draw-tool"]:checked').val();
        self.tool = Canvas[toolName];
        // 色の保存
        var opt = opt || {color:'rgba(37,37,37,1)'};
        self.context.fillStyle = opt.color;
        // 開始
        self.tool.onStart(ev, self);
    };
    Canvas.prototype.finishDrawing = function(ev, self) {
        // アクション開始時に記憶した状態の破棄
        self.storedImageData = null;
        // 押下を開放
        self.isMouseDown = false;
        // 終了
        self.tool.onFinish(ev, self);
        // 初期化
        self.init();
    };
    Canvas.prototype.toDataURL = function(format) {
        return this.canvas.toDataURL(format);
    };
})();
