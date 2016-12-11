import {Model} from "chomex";

export default class Config extends Model {}
Config.default = {
    "closeconfirm": {
        value: "おっぱああああい!!"
    },
    "download-folder": {value: "艦これ"},
    "directly-download-on-capture": {value: false},
    "notification-for-default": {
        label:   "通知",
        enabled: true,
        icon:    null,
        sound:   null,
        volume:  80,
    },
    "notification-for-mission": {
        label:   "▸ 遠征タイマー",
        enabled: true,
        icon:    null,
        sound:   null,
    },
    "notification-for-recovery": {
        label:   "▸ 修復タイマー",
        enabled: true,
        icon:    null,
        sound:   null,
    },
    "notification-for-createship": {
        label:   "▸ 建造タイマー",
        enabled: true,
        icon:    null,
        sound:   null,
    },
    "notification-for-tiredness": {
        label:   "▸ 疲労タイマー",
        icon:    null,
        sound:   null,
        time:    15,
        description: "出撃からの固定時間通知です",
    },
    "debug": {
        value: false
    }
};
