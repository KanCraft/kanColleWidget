/* tslint:disable object-literal-sort-keys */

interface MapCatalog {
    [id: number]: {
        title: string;
        maps: {
            [no: number]: {
                title: string;
                extra?: boolean;
            };
        };
    };
}

const catalog: MapCatalog = {
    1: {
        title: "鎮守府海域",
        maps: {
            1: {
                title: "鎮守府正面海域",
            },
            2: {
                title: "南西諸島沖",
            },
            3: {
                title: "製油所地帯沿岸",
            },
            4: {
                title: "南西諸島防衛戦",
            },
            5: {
                title: "鎮守府近海",
                extra: true,
            },
        },
    },
    2: {
        title: "南西諸島海域",
        maps: {
            1: {
                title: "南西諸島近海",
            },
            2: {
                title: "バシー海峡",
            },
            3: {
                title: "東部オリョール海",
            },
            4: {
                title: "沖ノ鳥島海域",
            },
            5: {
                title: "沖ノ鳥島沖",
                extra: true,
            },
        },
    },
    3: {
        title: "北方海域",
        maps: {
            1: {
                title: "モーレイ海",
            },
            2: {
                title: "キス島沖",
            },
            3: {
                title: "アルフォンシーノ方面",
            },
            4: {
                title: "北方海域全域",
            },
            5: {
                title: "北方AL海域",
                extra: true,
            },
        },
    },
    4: {
        title: "西方海域",
        maps: {
            1: {
                title: "ジャム島沖",
            },
            2: {
                title: "カレー洋海域",
            },
            3: {
                title: "リランカ島",
            },
            4: {
                title: "カスガダマ島",
            },
            5: {
                title: "カレー洋リランカ島沖",
                extra: true,
            },
        },
    },
    5: {
        title: "南方海域",
        maps: {
            1: {
                title: "南方海域前面",
            },
            2: {
                title: "珊瑚諸島沖",
            },
            3: {
                title: "サブ島沖海域",
            },
            4: {
                title: "サーモン海域",
            },
            5: {
                title: "サーモン海域北方",
            },
        },
    },
    6: {
        title: "南部海域",
        maps: {
            1: {
                title: "中部海域哨戒線",
            },
            2: {
                title: "MS諸島沖",
            },
            3: {
                title: "グアノ環礁沖海域",
            },
            4: {
                title: "中部北海域ピーコック島沖",
            },
            5: {
                title: "KW環礁沖海域",
                extra: true,
            },
        },
    },
    7: {
        title: "南西海域",
        maps: {
            1: {
                title: "ブルネイ泊地沖",
            },
        },
    },
};

export default catalog;
