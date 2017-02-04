### global process:false ###
manifest = require "../manifest.json"
module.exports = (version, args) =>
    version = version || manifest.version
    args    = args    || process.argv
    i = args.findIndex (arg) => arg == "-v"
    return args[i+1] if i > 0 and (args.length - 1) > i
    versions = version.split "."
    minor = parseInt versions.pop()
    return versions.concat(minor + 1).join "."
