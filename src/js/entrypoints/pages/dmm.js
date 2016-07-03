import {FRAME_SHIFT, EXTRACT} from '../../Components/Constants';
import ExtractFlash from '../../Components/Routine/ExtractFlash';

chrome.runtime.connect();

import {Client} from 'chomex';
const client = new Client(chrome.runtime);
client.message({act: '/window/should-decorate'}, true).then((res) => {
  // いずれにしもてこれは必要っぽいなと
  window.resizeBy(
    window.outerWidth - window.innerWidth,
    window.outerHeight - window.innerHeight
  );

  switch(res.data.decoration) {
  case FRAME_SHIFT:
    $('body').css({position: 'fixed'});
    $('body').animate({
      'top'     : '-77px', // TODO: get from res.data.offset
      'left'    : '-110px' // TODO: get from res.data.offset
    }, 1000);
    break;
  case EXTRACT:
    const routine = ExtractFlash.init(window);
    routine.onload().then(iframe => routine.replace(iframe));
    break;
  default:
    alert(`UNKNOWN DECORATION: ${res.data.decoration}`);
  }
});

client.message({act: '/config/get', key:'closeconfirm'}, true).then((res = {}) => {
  if (res.data.value) {
    window.onbeforeunload = () => { return res.value || 'デフォルトのやつ'; };
  }
})
