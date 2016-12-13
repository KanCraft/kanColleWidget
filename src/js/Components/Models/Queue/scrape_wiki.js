
let Client = require('cheerio-httpcli');

let fixed_missions = [
    {id: '33',  title: '前衛支援任務(南方)',     time: 900000},
    {id: '34',  title: '決戦支援任務(南方)',     time: 1800000},
    {id: '197', title: '前衛支援任務(イベント)', time: 900000},
    {id: '198', title: '決戦支援任務(イベント)', time: 1800000},
    {id: '-1',  title: 'DEBUG: 今すぐのやつ', time: 0},
];


Client.fetch('http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC', (err, $, res) => {
    let missions = $('h2#h2_content_1_4').next().next().find('tr').map((index, element) => {
        let id    = $(element).find('td:nth-child(1)').text();
        let title = $(element).find('td:nth-child(2)').text();
        let time  = $(element).find('td:nth-child(3)').text();
        if (id.match(/^\d+$/) && title.match(/^.+$/) && time.match(/^(\d+):(\d+)$/)) {
            let ms = time.match(/^(\d+):(\d+)$/);
            return {id: id, title: title, time: (Number(ms[1]) * 60 + Number(ms[2])) * 60 * 1000};
        } else {
            return undefined;
        }
    }).toArray().concat(fixed_missions);
    var result = {};
    for (index in missions) {
        result[missions[index].id] = {title: missions[index].title, time: missions[index].time};
    }
    console.log(JSON.stringify(result, null, ' '));
});

