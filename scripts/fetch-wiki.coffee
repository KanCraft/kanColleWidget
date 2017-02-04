### global process:false ###
require "colors"
Client   = require "cheerio-httpcli"
_        = require "lodash"
fs       = require "fs"
rl = require("readline").createInterface(
    input: process.stdin
    output: process.stdout
)

catalog = "./src/js/Components/Models/Queue/missions.json"

fixed_missions = [
    {id: "33",  title: "前衛支援任務(南方)",     time: 900000},
    {id: "34",  title: "決戦支援任務(南方)",     time: 1800000},
    {id: "197", title: "前衛支援任務(イベント)", time: 900000},
    {id: "198", title: "決戦支援任務(イベント)", time: 1800000},
    {id: "-1",  title: "DEBUG: 今すぐのやつ", time: 0},
    {id: "0",   title: "マニュアル登録されたやつ", time: 0},
]

Client.fetch("http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC")
.then (res) =>
    $ = res.$;
    missions = $("h2#h2_content_1_4").next().next().find("tr").map((index, element) =>
        id    = $(element).find("td:nth-child(1)").text()
        title = $(element).find("td:nth-child(2)").text()
        time  = $(element).find("td:nth-child(3)").text()
        return if !id.match(/^[0-9]+$/) or !title.match(/^.+$/) or !time.match(/^([0-9]+):([0-9]+)$/)
        ms = time.match(/^([0-9]+):([0-9]+)$/);
        return {id: id, title: title, time: (Number(ms[1]) * 60 + Number(ms[2])) * 60 * 1000}
    ).toArray().concat(fixed_missions)
    return Promise.resolve missions
.then (missions) =>
    dict = _.chain(missions).keyBy("id").mapValues((mission) =>
        delete mission["id"]
        return mission
    ).value()
    return Promise.resolve(dict)
.then (missions) =>
    console.log "以下の遠征をwikiから取得しました".green
    console.log missions, "\n"
    return new Promise (resolve, reject) =>
        rl.question "#{catalog}を更新しますか？ (y/n) ".green, (answer) =>
            rl.close()
            if answer.match(/y/i) then resolve missions else reject "Declined"
.then (missions) =>
    fs.writeFileSync catalog, JSON.stringify(missions, null, 2)
.catch (err) =>
    console.log "中断しました".yellow, err
