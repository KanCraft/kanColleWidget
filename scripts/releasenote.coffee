nextversion = require "./nextversion"
exec        = require("shelljs").exec
moment      = require "moment"
require "colors"

logger = (verbose) =>
  () => console.log.apply(console, arguments) if verbose

releasenote = (verbose = false) =>
  latest = exec("git describe --tags", {silent:true}).stdout
  out = exec("git log --pretty=%b #{latest}..HEAD", silent:true).stdout || ""

  trace = logger verbose

  version = nextversion()
  trace "VERSION".green if verbose
  trace version if verbose

  features = out.split("\n")
    .filter((line) => !!line and line.match(/^FEATURE: /))
    .map((line) => line.replace /^FEATURE: +/, "")
  throw new Error "直近のrefsまでのコミットにFEATUREタグが見当たりません" if features.length is 0
  trace "\nFEATURES".green
  trace features.map((f) => "- " + f).join("\n") if verbose

  comment = out.split("\n")
    .filter((line) => !!line and line.match(/^COMMENT: /))
    .map((line) => line.replace /^COMMENT: /, "").join()
  comment = null if comment.length is 0
  trace "\nCOMMENT".green
  trace comment
  trace "\n"

  return {
    version: nextversion()
    contents:
      features: features
      date: moment.utc().add(9, "hours").format("YYYY/MM/DD")
      comment: comment
  }

module.exports = releasenote
