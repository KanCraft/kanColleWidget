fetchMissions = require("./fetch-wiki-missions");
fetchRemodels = require("./fetch-wiki-remodels");

Promise.resolve()
.then(() => fetchMissions())
.then(() => fetchRemodels())
