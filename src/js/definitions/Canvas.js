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

        // TODO: これをスタックにして、複数Undoできるようにする
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
        this.delegateActionButton();
        this.storedImageData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
    };
    Canvas.prototype.delegateActionButton = function() {
        // ひどい設計だなこれ
        var self = this;
        $('.paint-action').on('click',function(ev){
            var action = $(ev.currentTarget).attr('action');
            self[action](ev);
        });
    };
    Canvas.prototype.Undo = function() {
        this.context.putImageData(this.storedImageData,0,0);
    };
    Canvas.prototype.Reset = function() {
        // とりあえずこの実装でも問題無いと思う
        location.reload();
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
        // アクション開始時の状態を保存
        self.storedImageData = self.context.getImageData(0,0,self.canvas.width,self.canvas.height);
        // マウス押下状態を記憶
        self.isMouseDown = true;
        // メソッドの指定
        var toolName = $(':radio[name="draw-tool"]:checked').val();
        self.tool = Canvas[toolName];
        // 色の保存
        var color = document.getElementById('color').value;
        var opt = {color: color};
        self.context.fillStyle = opt.color;
        // 開始
        self.tool.onStart(ev, self);
    };
    Canvas.prototype.finishDrawing = function(ev, self) {
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
