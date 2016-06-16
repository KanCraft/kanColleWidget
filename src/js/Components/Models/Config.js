import {Model} from 'chomex';

export default class Config extends Model {}
Config.default = {
  'winconfigs': {
    value: [
      {
        id: '小型',
        alias: '小型',
        size: {width: 400, height: 240},
        decoration: 'EXTRACT'
      }
    ]
  },
  'closeconfirm': {
    value: 'おっぱああああい!!'
  }
};
