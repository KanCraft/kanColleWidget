### global process:false ###
require "colors"
Client   = require "cheerio-httpcli"
_        = require "lodash"
fs       = require "fs"

catalog = "./src/js/Components/Models/Remodel/catalog.json"

class Records
  constructor: () ->
    @records = []
    @category =
      name: null
      count: 0
    @equip =
      name: null
      count: 0
    @ships = []
    @comment =
      value: null
      count: 0

  add: (tr) ->
    # f = $(tr).contents().first()
    try
      switch tr.contents().length
        when 11
          row11cols.call @, tr
        when 10
          row10cols.call @, tr
        when 9
          row9cols.call @, tr
        when 8
          row8cols.call @, tr
    catch err
      throw "#{@equip.name}: #{err.toString()}"

  """
  11列ある場合は、これはぜったいにカテゴリ最初のやつなので、全部初期化する
  """
  row11cols = ($tr) ->
    @category =
      name: $tr.contents().eq(0).text().replace("｜","ー")
      count: parseInt($tr.contents().eq(0).prop("rowspan"))
    @equip =
      name: $tr.contents().eq(1).text()
      count: parseInt($tr.contents().eq(1).prop("rowspan"))
    @ships = getShips.call(@, $tr.contents().eq(9)) || []
    @comment =
      value: getComment.call(@, $tr.contents().eq(10))
      count: parseInt($tr.contents().eq(10).prop("rowspan"))
    @records = @records.concat(zip.call(@, getAvailability.call(@, $tr.find("td").slice(1,8))))

  """
  10列の場合は、カテゴリは同じだが、装備名が異なる場合で、
  装備名, [曜日], 第二番艦, コメント
  という行
  """
  row10cols = ($tr) ->
    @equip =
      name: $tr.contents().eq(0).text()
      count: parseInt($tr.contents().first().prop("rowspan"))
    @ships = getShips.call(@, $tr.contents().eq(8)) || []
    @comment =
      value: getComment.call(@, $tr.contents().eq(9))
      count: parseInt($tr.contents().eq(9).prop("rowspan"))
    @records = @records.concat(zip.call(@, getAvailability.call(@, $tr.find("td").slice(1,8))))

  """
  9列の場合は、カテゴリも同じ、装備名も同じ、だけどコメントが異なる場合で、
  [曜日], 第二番艦, コメント
  という行
  """
  row9cols = ($tr) ->
    @ships = getShips.call(@, $tr.contents().eq(7)) || []
    @comment =
      value: getComment.call(@, $tr.contents().eq(8))
      count: parseInt($tr.contents().eq(8).prop("rowspan"))
    @records = @records.concat(zip.call(@, getAvailability.call(@, $tr.find("td").slice(0,7))))

  """
  8列という場合は、1週間7日間+二番艦の指定だけ
  """
  row8cols = ($tr) ->
    @ships = getShips.call(@, $tr.contents().eq(7)) || []
    @records = @records.concat(zip.call(@, getAvailability.call(@, $tr.find("td").slice(0,7))))

  getShips = ($col) ->
    return $col.text().split(/[\n,\/]+/)

  getComment = ($col) ->
    return $col.text()

  getAvailability = (days) ->
    for day in days
      throw "不明な可否記号です: #{day.children[0].data}" if day.children[0].data.trim() not in ["〇","◯","×"]
    (day.children[0].data == "〇" for day in days)

  zip = (avlbl) ->
    ({
      category:  @category.name,
      equipment: @equip.name,
      available: avlbl,
      ship:      ship,
      comment:   @comment.value
    } for ship in @ships)

main = () ->
  Client.fetch("http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3")
  .then (res) =>
    $ = res.$
    updated = (new Date($("td#rgn_content5").children("p").html().match(/([0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2})/).pop())).getTime()
    records = new Records((selector) -> $(selector))
    $("td#rgn_content5").children("div").children("table").children("tbody").children("tr").map (i, r) =>
      records.add($(r))
    return Promise.resolve({updated:updated, records:records.records})
  .then (entry) =>
    console.log "全#{entry.records.length}件の改修工廠レコードを取得しました".green
    rl = require("readline").createInterface(
        input: process.stdin
        output: process.stdout
    )
    return new Promise (resolve, reject) =>
      rl.question "#{catalog}を更新しますか？ (y/n) ".yellow, (answer) =>
        rl.close()
        if answer.match(/y/i) then resolve entry else reject "Declined"
  .then (entry) =>
    fs.writeFileSync catalog, JSON.stringify(entry, null, 2)
    console.log "#{catalog}への書き込みが完了しました".green
    return Promise.resolve()
  .catch (err) =>
    console.log "中断しました".yellow, err
    return Promise.resolve()

module.exports = main
