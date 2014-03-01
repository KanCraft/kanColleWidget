/* static */
var Constants = {
    release : {
        version: "v1.0.4",
        link: 'https://github.com/otiai10/kanColleWidget/pull/365',
        announceVersion : 41,
        announcements   : [
            '新しい遠征の追加',
            '(ご報告ありがとうございました！)'
        ]
    },
    mission : {
        "1"   : {minute:15,   title: '練習航海'},
        "2"   : {minute:30,   title: '長距離練習航海'},
        "3"   : {minute:20,   title: '警備任務'},
        "4"   : {minute:50,   title: '対潜警戒任務'},
        "5"   : {minute:90,   title: '海上護衛任務'},
        "6"   : {minute:40,   title: '防空射撃演習'},
        "7"   : {minute:60,   title: '観艦式予行'},
        "8"   : {minute:180,  title: '観艦式'},
        "9"   : {minute:240,  title: 'タンカー護衛任務'},
        "10"  : {minute:90,   title: '強行偵察任務'},
        "11"  : {minute:300,  title: 'ボーキサイト輸送任務'},
        "12"  : {minute:480,  title: '資源輸送任務'},
        "13"  : {minute:240,  title: '鼠輸送作戦'},
        "14"  : {minute:360,  title: '包囲陸戦隊撤収作戦'},
        "15"  : {minute:720,  title: '囮機動部隊支援作戦'},
        "16"  : {minute:900,  title: '艦隊決戦援護作戦'},
        "17"  : {minute:45,   title: '敵地偵察作戦'},
        "18"  : {minute:300,  title: '航空機輸送作戦'},
        "19"  : {minute:360,  title: '北号作戦'},
        "20"  : {minute:120,  title: '潜水艦哨戒任務'},
        "21"  : {minute:140,  title: '北方鼠輸送作戦'},
        "22"  : {minute:180,  title: '艦隊演習'},
        "25"  : {minute:2400, title: '通商破壊作戦'},
        "26"  : {minute:4800, title: '敵母港空襲作戦　'},
        "27"  : {minute:1200, title: '潜水艦通商破壊作戦'},
        "28"  : {minute:1500, title: '西方海域封鎖作戦'},
        "29"  : {minute:1440, title: '潜水艦派遣演習'},
        "30"  : {minute:2880, title: '潜水艦派遣作戦'},
        "33"  : {minute:15,   title: '前衛支援任務'},
        "34"  : {minute:30,   title: '決戦支援任務'},
        "35"  : {minute:420,  title: 'MO作戦'},
        "36"  : {minute:540,  title: '水上機基地建設'},
        "37"  : {minute:165,  title: '東京急行'}
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
                "抜錨！",
                "提督...お前ちょっと、ウザい！",
                "お前に最高の勝利を与えてやる",
                "おぉー、ぐっじょーぶ！",
                "ご主人さま！調子に乗ると、ブッ飛ばしますよ♪",
                "ぱんぱかぱ〜ん！",
                "格納庫まさぐるのやめてくれない！？",
                "衝突しないようにしないとっ",
                "おはようございますー、って、今何時？まーいっかぁ！",
                "幸運の女神のキスを感じちゃいます！",
                "九三式酸素魚雷って冷たくて、素敵...",
                "褒められて伸びるタイプなんです",
                "ﾋｬｯハー!!!!",
                "潜ります？潜っちゃいます？",
                "あら、あらあら♪",
                "マイク音量大丈夫…？チェック、1、2...",
                "はい、大丈夫です",
                "勝利を！　提督に！",
                "クマ？",
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
                    {url:'src/img/loader/000.jpg',title:'鳥'},
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
                    {url:'src/img/loader/020.jpg',title:'零式艦戦21型'},
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
