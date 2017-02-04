/**
 * なんか書く
 */
(function() {
    var http = function(method, url, params = {}) {
        var xhr = new XMLHttpRequest();
        var p = new Promise(function(resolve, reject) {
            xhr.onreadystatechange = function() {
                if (this.readyState !== XMLHttpRequest.DONE) return;
                if (100 < this.status && this.status < 400) {
                    resolve(this.response);
                } else {
                    reject(this.response);
                }
            };
            xhr.open(method, url);
            xhr.send(params);
        });
        return p;
    };

    var main = function() {
        http("GET", "https://raw.githubusercontent.com/otiai10/kanColleWidget/develop/release.json")
        .then(res => Promise.resolve(JSON.parse(res)))
        .then(versions => {
            var release = document.querySelector("ul#release");
            versions.map(version => {
                var features = document.createElement("ul");
                version.features.map(feature => {
                    var f = document.createElement("li");
                    f.innerHTML = feature;
                    features.appendChild(f);
                });
                var ver = document.createElement("li");
                ver.innerHTML = version.version + " （" + version.date + "）";
                ver.appendChild(features);
                release.appendChild(ver);
            });
        });
    };

    main();
})();
