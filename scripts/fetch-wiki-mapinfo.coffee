### global process:false ###
require "colors"
Client   = require "cheerio-httpcli"
_        = require "lodash"
fs       = require "fs"

catalog = "./src/js/Services/SortieContext/catalog.json"

class MapInfo
  @make: (title, table) ->
    return new @(title, table)

  constructor: (title, table) ->
    @title = title
    @areas = @get_areas(table)

  get_areas: ($table) ->
    $rows = $table.find('tr')
    areas = {}
    id    = 1
    for _, i in $rows
      $row = $rows.eq(i)
      continue unless $row.find('td').length is 6
      areas[id] = new Area($row)
      id++
    return areas

class Area
  constructor: ($row) ->
    tds = $row.find('td')
    @name  = tds.eq(0).text()
    @level = tds.eq(1).text().length
    @exp   = tds.eq(2).text().length
    @operation = tds.eq(3).text()
    @description = tds.eq(4).text()
    @items = tds.eq(5).text()

main = () ->
  Client.fetch("http://wikiwiki.jp/kancolle/?%BD%D0%B7%E2")
  .then (res) =>
    $ = res.$
    updated = (new Date($("div#lastmodified").text().replace("Last-modified:", "").trim())).getTime()
    titles = $("h2")
    tables = $("table.style_table")
    dict   = {}
    id = 1
    titles.map (i, title) ->
      info = MapInfo.make($(title).text().trim(), tables.eq(i))
      dict[id] = info unless info is null
      id++
    return Promise.resolve({updated:updated, dict:dict})
  .then (entry) ->
    console.log "全#{Object.keys(entry.dict).length}件の海域情報を取得しました".green
    rl = require("readline").createInterface(
        input:  process.stdin
        output: process.stdout
    )
    return new Promise (resolve, reject) =>
      rl.question "#{catalog}を更新しますか？ (y/n) ".yellow, (answer) =>
        rl.close()
        if answer.match(/y/i) then resolve entry else reject "Declined"
    console.log JSON.stringify(entry.dict, null, 2)
  .then (entry) ->
    fs.writeFileSync catalog, JSON.stringify(entry, null, 2)
    console.log "#{catalog}への書き込みが完了しました".green
    return Promise.resolve()
  .catch (err) ->
    console.log "中断しました".yellow, err

module.exports = main
