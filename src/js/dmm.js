// console.log(chrome.runtime.getManifest());
chrome.runtime.connect();

// chrome.runtime.sendMessage({act: '/history/get'}, (res) => {
//   console.log("RESPONSE of /foo", res);
// });

import {Client,Router} from 'chomex';
const client = new Client(chrome.runtime);
// client.message({act: '/config/get', key: 'winconfig'}).then(res => {
//   console.log("script", res);
// });

let router = new Router();

// Backgroundからリサイズ要請があったときはなんかする
router.on('/page/dmm/resize', (message) => {
  window.alert('メッセージは受け取れた');
  window.resizeBy(
    window.outerWidth - window.innerWidth,
    window.outerHeight - window.innerHeight
  );
  $('body').css({
    //'transform':'scale(0.8)'
    'position': 'fixed'
  });
  $('body').animate({
    'top'     : '-77px',
    'left'    : '-110px'
  },500);
});

chrome.runtime.onMessage.addListener(router.listener());

//   $('body').css({
//     //'transform':'scale(0.8)'
//     'position': 'fixed'
//   });
//   $('body').animate({
//     'top'     : '-77px',
//     'left'    : '-110px'
//   },500);
// };
