import ImageRecognizationService from '../../Services/ImageRecognizationService';
const irs = new ImageRecognizationService();

import {Logger} from 'chomex';
const logger = new Logger();

var __dock_id = null;

export function onRecoveryStart(detail) {
  const {requestBody:{formData:{api_ndock_id:[dock_id]}}} = detail;
  __dock_id = parseInt(dock_id);
}

// TODO: いやーだからこれどっかに持って行こうよ...
var sleep = (seconds) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
};

export function onRecoveryStartCompleted(detail) {
  sleep(0.85)
  .then(() => {
    return irs.test({purpose: 'recovery', dock: __dock_id});
  })
  .then(nums => {
    // FIXME: とりあえず
    // alert(
    //   "画像diffにより、以下を検出\n"
    //   + `${nums[0]}${nums[1]}:${nums[2]}${nums[3]}\n`
    //   + "あとはこれでタイマーセットすればいい"
    // );
    logger.info(`${nums[0]}${nums[1]}:${nums[2]}${nums[3]}`);
  });
}
