// self is the scope of worker itself
/* global self:true, importScripts:false, GIFEncoder:false */
importScripts('../jsgif/GIFEncoder.js', '../jsgif/LZWEncoder.js', '../jsgif/NeuQuant.js');
self.count = 0;
self.addEventListener('message', function(ev) {
  var data = ev.data;
  switch (data.cmd) {
  case 'start':
    // init encoder
    self.encoder = new GIFEncoder();
    self.encoder.setSize(680, 400);
    self.encoder.setRepeat(0);
    self.encoder.setDelay(1000/ (data.params.fps || 2));
    // encoder start
    self.encoder.start();
    break;
  case 'frame':
    self.encoder.addFrame(data.frame, true);
    // self.encoder.addFrame(data.frame);
    // self.encoder.addFrame(data.img, true);
    self.count += 1;
    self.postMessage({message:'progress', count:self.count});
    break;
  case 'over':
    self.encoder.finish();
    var binary = self.encoder.stream().getData();
    self.postMessage({message:'done', binary: binary});
    /* これは向こう
    var buffer = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    var blob = new Blob([buffer.buffer], {type:"image/gif"});
    var url = URL.createObjectURL(blob);
    */
    /*
    var a = document.createElement("a");
    a.href = url;
    a.download = "unko" + ".gif";
    a.click();

    URL.revokeObjectURL(a.href)
    */
  }
});
