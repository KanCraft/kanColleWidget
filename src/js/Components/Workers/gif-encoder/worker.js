/* eslint-env worker */
/* global GIFEncoder:false encode64:false */

import imports from "../imports";

const _init = (data) => {
    imports(data.root)("jsgif/GIFEncoder.js", "jsgif/LZWEncoder.js", "jsgif/NeuQuant.js", "jsgif/b64.js");
    self.encoder = new GIFEncoder();
    self.encoder.setRepeat(0);
    // {{{ TODO: 変更可能にする
    self.encoder.setSize(800, 480);
    self.encoder.setDelay(25);
    // }}}
    self.encoder.start();
};
const _add = (data) => {
    self.encoder.addFrame(data.frame, true);
};
const _finish = () => {
    self.encoder.finish();
    const base64 = encode64(self.encoder.stream().getData());
    self.postMessage({status:200,message:"done",data:{base64}});
};

onmessage = ({data}) => {
    switch(data.cmd) {
    case "add":
        return _add(data);
    case "finish":
        return _finish(data);
    case "init":
    default:
        return _init(data);
    }
};
