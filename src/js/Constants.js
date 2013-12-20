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
            "28" : 1500,
            "29" : 1440,
            "30" : 2880,
            "33" : 15,
            "34" : 30,
            "35" : 420,
            "36" : 540,
            "109" : 15,
            "110" : 30
        }
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
                "Acht acht！…… あ、違った",
                "ごっはんー♪ ごっはんー♪",
                "っぽい？",
                "雨は・・・いつか止むさ",
                "もっともっと速くなってもいいの？",
                "フフフ、怖いか？",
                "あら～、もう声も出ませんか？",
                "司令官、私が居るじゃない！",
                "なのです！",
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
        },
        sortie : {
            end_prefix : "第",
            end_suffix : "艦隊の疲労がだいたい回復しました"
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
                width  : (10/83),
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
                    top : (0.421)
                },
                {// kdock_id == 4
                    left : (0.492),
                    top : (0.520)
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
        // Triplet pattern
        // Doublet pattern
        // Singlet pattern
        '\\s'    : ''
    },

    ocr : {
        failureCause : "\n（画面が小さい・解像度が低いなどの環境で失敗しやすいです）",
        delay : 850, //mili sec
        loader : {
            images : {
                normal : [
                    {url:'src/img/loader/000.jpg',title:'蒼き鋼のアルペジオより<br>タカオ'},
                    //-----------001~010
                    {url:'src/img/loader/001.jpg',title:'12cm単装砲'},
                    {url:'src/img/loader/002.jpg',title:'12.7cm連装砲'},
                    {url:'src/img/loader/003.jpg',title:'10cm連装高角砲'},
                    {url:'src/img/loader/004.jpg',title:'14cm単装砲'},
                    {url:'src/img/loader/005.jpg',title:'15.5cm三連装砲'},
                    {url:'src/img/loader/006.jpg',title:'20.3cm連装砲'},
                    {url:'src/img/loader/007.jpg',title:'35.6cm連装砲'},
                    {url:'src/img/loader/008.jpg',title:'41cm連装砲'},
                    {url:'src/img/loader/009.jpg',title:'46cm三連装砲'},
                    {url:'src/img/loader/010.jpg',title:'12.7cm連装高角砲'},
                    //-----------011~020
                    {url:'src/img/loader/011.jpg',title:'15.2cm単装砲'},
                    {url:'src/img/loader/012.jpg',title:'15.5cm三連装砲(副砲)'},
                    {url:'src/img/loader/013.jpg',title:'61cm三連装魚雷'},
                    {url:'src/img/loader/014.jpg',title:'61cm四連装魚雷'},
                    {url:'src/img/loader/015.jpg',title:'61cm四連装(酸素)魚雷'},
                    {url:'src/img/loader/016.jpg',title:'九七式艦攻'},
                    {url:'src/img/loader/017.jpg',title:'天山'},
                    {url:'src/img/loader/018.jpg',title:'流星'},
                    {url:'src/img/loader/019.jpg',title:'九六式艦戦'},
                    {url:'src/img/loader/020.jpg',title:'零式艦戦24型'},
                    //-----------021~030
                    {url:'src/img/loader/021.jpg',title:'零式艦戦52型'},
                    {url:'src/img/loader/022.jpg',title:'烈風'},
                    {url:'src/img/loader/023.jpg',title:'九九式艦爆'},
                    {url:'src/img/loader/024.jpg',title:'彗星'},
                    {url:'src/img/loader/025.jpg',title:'零式水上偵察機'},
                    {url:'src/img/loader/026.jpg',title:'瑞雲'},
                    {url:'src/img/loader/030.jpg',title:'21号対空電探'},
                    //-----------031~040
                    {url:'src/img/loader/032.jpg',title:'14号対空電探'},
                    {url:'src/img/loader/034.jpg',title:'強化型艦本式缶'},
                    {url:'src/img/loader/035.jpg',title:'三式弾'},
                    {url:'src/img/loader/036.jpg',title:'九一式徹甲弾'},
                    {url:'src/img/loader/037.jpg',title:'7.7mm機銃'},
                    {url:'src/img/loader/038.jpg',title:'12.7mm単装機銃'},
                    {url:'src/img/loader/039.jpg',title:'25mm連装機銃'},
                    {url:'src/img/loader/040.jpg',title:'25mm三連装機銃'},
                    //-----------041~050
                    {url:'src/img/loader/041.jpg',title:'甲標的 甲'},
                    {url:'src/img/loader/044.jpg',title:'九四式爆雷投射機'},
                    {url:'src/img/loader/046.jpg',title:'九三式水中聴音機'},
                    {url:'src/img/loader/047.jpg',title:'三式水中探信儀'},
                    //-----------051~060
                    {url:'src/img/loader/051.jpg',title:'12cm30連装噴進砲'},
                    {url:'src/img/loader/054.jpg',title:'彩雲'},
                    {url:'src/img/loader/055.jpg',title:'紫電改二'},
                    {url:'src/img/loader/058.jpg',title:'61cm五連装(酸素)魚雷'},
                    //-----------051~060
                    {url:'src/img/loader/065.jpg',title:'15.2cm連装砲'},
                    {url:'src/img/loader/066.jpg',title:'8cm高角砲'}
                ]
            }
        }
    }
};
