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
        if (! self.isMouseDown) return;
        self.updateRect(ev, self);
    };
    Canvas.prototype.updateRect = function(ev, self) {
        // cancel by former record
        self.cancelRect(self.start, self.end);
        // record new
        self.end = {
            x: ev.offsetX,
            y: ev.offsetY
        };
        self.drawRect(self.start, self.end);
    };
    Canvas.prototype.startDrawing = function(ev, self) {
        self.isMouseDown = true;
        self.start = {
            x: ev.offsetX,
            y: ev.offsetY
        };
    };
    Canvas.prototype.finishDrawing = function(ev, self) {
        self.isMouseDown = false;
        if (self.start == null) return;
        self.end = {
            x: ev.offsetX,
            y: ev.offsetY
        };
        self.drawRect(self.start, self.end);
        self.init();
    };
    Canvas.prototype.drawRect = function(start, end, opt) {
        opt = opt || {color:'rgba(37,37,37,1)'};
        this.context.fillStyle = opt.color;
        this.context.fillRect(
            start.x,
            start.y,
            end.x - start.x,
            end.y - start.y
        );
    };
    Canvas.prototype.cancelRect = function(start, end, opt) {
        if (start == null || end == null) return;
        this.context.clearRect(
            start.x,
            start.y,
            end.x - start.x,
            end.y - start.y
        );
    };
})();
