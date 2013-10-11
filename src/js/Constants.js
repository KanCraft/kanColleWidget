/***** class definition *****/

/* static */
var Constants = {/** constantアクセサ的なアレ **/
    time :{
        mission : {
             "1" : 15,
             "2" : 30,
             "3" : 20,
             "4" : 50,
             "5" : 90,
             "6" : 40,
             "7" : 60,
             "8" : 180,
             "9" : 240,
            "10" : 90,
            "11" : 300,
            "12" : 480,
            "13" : 240,
            "14" : 360,
            "15" : 720,
            "16" : 900,
            "17" : 45,
            "18" : 300,
            "19" : 360,
            "20" : 120,
            "25" : 2400,
            "26" : 4800,
            "27" : 1200,
            "35" : 420,
            "36" : 540
        },
        notifyOffset : 50 * 1000 //50秒
    },
    widget : {
        title : {
            rate : 0.99,
            default : [
                "艦これウィジェット",
                "艦これウィジェット",
                "艦これウィジェット",
                "艦これウィジェット",
                "あかつきの水平線に勝利を刻むのです",
            ],
            special : [ // セリフ。
                "クマ？",
                "勝利を！　提督に！",
                "ひえ〜",
                "紅茶が飲みたいネー",
                "五航戦の子なんかと一緒にしないで",
                "嬉しいわ、もっと働ける！",
                "...知らない子ですね",
                "駆逐艦？あぁ...ウザい。",
                "いいねぇ、しびれるねぇ。ありがとねっ",
                "艦これウィジェットが使いづらくっても、那珂ちゃんのことは嫌いにならないでください！"
            ]
        },
        width : {
            '1200': {
                zoom : '1.5',
                mode : 'l'
            },
            '800' : {
                zoom : '1',
                mode : 'm'
            },
            '600' : {
                zoom : '0.75',
                mode : 's'
            },
            '400' : {
                zoom : '0.5',
                mode : 'xs'
            }
        },
        aspect : 0.6
    },
    popup : {
      title : "提督 仕事しろ"
    },
    notification : {
        title : "艦これウィジェット",
        img : './icon.png',
        mission : {
            end_prefix : "第",
            end_suffix : "艦隊がまもなく帰投します"
        },
        createship : {
            end_prefix : "第",
            end_suffix : "建造ドックでの建造作業がまもなく完了します"
        },
        nyukyo : {
            end_prefix : "第",
            end_suffix : "入渠ドックの修復作業がまもなく完了します"
        }
    },
    achievements : {
        'mission_count'   : '遠征',
        'createship_count': '建造',
        'createitem_count': '開発',
        'map_count'       : '出撃',
        'hokyu_count'     : '補給',
        'kaisou_count'    : '近改',
        'practice_count'  : '演習'
    },

    trimmingParamsMapping : {
        'createship' : {
            size : {
                width  : (1/8),
                height : (1/32)
            },
            coords : [
                {// kdock_id == 1
                    left : (0.492),
                    top : (0.225)
                },
                {// kdock_id == 2
                    left : (0.492),
                    top : (0.322)
                },
                {// kdock_id == 3
                    left : (0.492),
                    top : (0.419)
                },
                {// kdock_id == 4
                    left : (0.492),
                    top : (0.516)
                }
            ]
        },
        'nyukyo' : {
            size : {
                width  : (1/9),
                height : (1/28)
            },
            coords : [
                {// ndock_id == 1
                    left : (0.772),
                    top : (0.1925)
                },
                {// ndock_id == 2
                    left : (0.772),
                    top : (0.2935)
                },
                {// ndock_id == 3
                    left : (0.772),
                    top : (0.394)
                },
                {// ndock_id == 4
                    left : (0.772),
                    top : (0.498)
                }
            ]
        }
    },

    assuranceStringMap : {
        // Quartet pattern
        'lll!'   : '00',
        'Ill!'   : '00',
        'Illl'   : '00',
        'll1:'   : '02:',
        '\\{1\\-1':'04',
        '11\\-1' : '04',
        'Il\\-1' : '04',
        // Triplet pattern
        'Il4'    : '04',
        '1\\-0'  : '34',
        '0\\-1'  : '04',
        // Doublet pattern
        '\\(l'   : '0',
        '\\(\\|' : '0',
        '\\(1'   : '0',
        'l\\)'   : '0',
        '\\(\\)' : '0',
        '0\\]'   : '03',
        '\\|\\)' : '0',
        '\\(H'   : '04',
        '-\\|'   : '4',
        // Singlet pattern
        '\\|'    : '1',
        '\\['    : '1',
        '\\]'    : '1',
        '\\}'    : '3',
        '\\$'    : '5',
        '%'      : '36',
        'M'      : '14',
        'H'      : '4',
        'R'      : '8',
        'B'      : '8',
        'q'      : '9',
        'o'      : '0',
        'O'      : '0',
        'U'      : '0',
        'I'      : '1',
        'i'      : '1',
        'l'      : '1',
        '7.'     : '2',
        'Z'      : '2',
        'K'      : '3',
        'J'      : '3',
        'S'      : '5',
        's'      : '5',
        '\\s'    : '',
        '='      : ':',
        ';'      : ':'

    },

    ocr : {
        servers : [
            {
                name : 'ocr-kcwidget.oti10.com',
                port : ':5000'
            }
        ],
        failureCause : "\n（画面が小さい・解像度が低いなどの環境で失敗しやすいです）",
        upload : {
            protocol: 'http://',
            path    : '/upload',
            method  : 'POST'
        },
        loader : {
            images : {
                normal : [
                    'src/img/loader/0.gif',
                    'src/img/loader/1.gif',
                    'src/img/loader/2.gif',
                    'src/img/loader/3.gif',
                    'src/img/loader/4.gif'
                ]
            }
        }
    }
};
