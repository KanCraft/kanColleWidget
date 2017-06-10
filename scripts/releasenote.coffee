nextversion = require "./nextversion"
exec        = require("shelljs").exec
moment      = require "moment"
require "colors"

class ReleaseNote
  constructor: () ->
    @latest  = exec("git describe --tags --abbrev=0", {silent:true}).stdout.replace("\n", "")
    @version = nextversion()
    @date    = moment.utc().add(9, "hours").format("YYYY/MM/DD")
  features: () ->
    return @out().split("\n")
      .filter((line) => !!line and line.match(/^FEATURE: /))
      .map((line) => line.replace /^FEATURE: +/, "")
      .reverse()
  feature_list: () ->
    return @features().map((f) -> "- #{f}").join("\n")
  comment: () ->
    comments = @out().split("\n")
      .filter((line) => !!line and line.match(/^COMMENT: /))
      .map((line) => line.replace /^COMMENT: /, "")
    return if comments.length is 0 then "" else comments.join()
  out: () ->
    @_out = @_out || exec("git log --pretty=%s%n%b #{@latest}..HEAD", silent:true).stdout || ""
    return @_out
  json: () ->
    return {
      version: @version
      features: @features()
      date: @date
      comment: @comment()
    }
  pretty: () ->
    console.log "VERSION:".green
    console.log "- #{@version}"
    console.log ""
    console.log "FEATURES:".green
    console.log @feature_list()
    console.log ""
    console.log "COMMENT:".green
    console.log @comment()
    console.log ""

module.exports = ReleaseNote
