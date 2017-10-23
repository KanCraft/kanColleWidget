fetchMissions = require("./fetch-wiki-missions");
fetchRemodels = require("./fetch-wiki-remodels");
fetchMapInfo  = require("./fetch-wiki-mapinfo");

Promise.resolve()
.then(() => fetchMissions())
.then(() => fetchRemodels())
.then(() => fetchMapInfo())
