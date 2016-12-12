/* global process:false */
const _ = require("lodash");
const fs = require("fs");
require("colors"); // String.{color} が使えるようになる
const msec = 1000, S = 1 * msec, M = 60 * S, H = 60 * M;

var exec     = require("shelljs").exec;

if (exec("git status --short").stdout) {
    console.log("[艦これウィジェット][add-mission] git status が clean じゃないっぽい".yellow);
    process.exit(0);
}

var catalog = require("../src/js/Components/Models/Queue/missions.json");

const params = _.chain(process.argv).filter(arg => arg.match("=")).map(arg => {
    return arg.split("=");
}).fromPairs().value();

const timex = /^([0-9]{1,2}h)?([0-9]{1,2}m)?$/;
const err = ((p) => {
    if (!p.id)    return {"id":   ["Missing"]};
    if (!p.title) return {"title":["Missing"]};
    if (!p.time)  return {"time": ["Missing"]};
    if (!timex.test(p.time)) return {"time":["Invalid"]};
    else p.millisec = _.chain(p.time.match(timex).slice(1)).map(t => {
        if (!t) return 0;
        if (t.match(/h$/)) return parseInt(t.replace(/h$/, "")) * H;
        if (t.match(/m$/)) return parseInt(t.replace(/m$/, "")) * M;
    }).reduce((total, t) => { return total + t; }).value();
    return null;
})(params);

if (catalog[params.id]) {
    console.log(`遠征ID${params.id}はすでに以下の内容でカタログにあるっぽいです`.yellow);
    console.log(JSON.stringify(catalog[params.id], null, 2).yellow);
    process.exit(0);
}

if (err != null) {
    console.log(JSON.stringify(err, null, 2).red);
    process.exit(0);// npm-debug.logがうざいんで0でいいや
}

console.log("以下の遠征をカタログに追加します".green);
console.log(JSON.stringify(params, null, 2));

catalog[String(params.id)] = {
    title: params.title,
    time:  params.millisec
};

const f = "./src/js/Components/Models/Queue/missions.json";
fs.writeFileSync(f, JSON.stringify(catalog, null, 2));

console.log("遠征カタログの追加が完了しました".green);
exec("git diff");
console.log("next> git add && git commit");
const stderr = exec(`git add ${f} && git commit -m "遠征ID:${params.id}「${params.title}」の追加"`).stderr;
if (stderr) {
    console.log("コミット失敗したんでマニュアルでやってください".yellow);
} else {
    console.log("next> pull-reqお待ちしております".green);
}
