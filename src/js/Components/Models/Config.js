import {Model} from 'chomex';

export default class Config extends Model {}
Config.default = {
  'winconfigs': {
    value: [
      {
        id: '小型',
        alias: '小型',
        url: 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/',
        size: {width: 400, height: 240},
        decoration: 'EXTRACT'
      }
    ]
  },
  'closeconfirm': {
    value: 'おっぱああああい!!'
  }
};
