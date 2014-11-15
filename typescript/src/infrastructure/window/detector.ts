/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/chrome.d.ts" />

module KCW.Infra {
    export function detectWindow(exps: RegExp[]): JQueryPromise<chrome.windows.Window> {
        var found: boolean = false;
        var d = $.Deferred();
        chrome.windows.getAll({populate:true}, (wins: chrome.windows.Window[]) => {
            for (var i = 0; i < wins.length; i++) {
                var win: chrome.windows.Window = wins[i];
                if (! win.tabs || win.tabs.length == 0) continue;
                if (strings(win.tabs[0].url).hit(exps)) return d.resolve(win);
            }
            return d.reject();
        });
        return d.promise();
    }

}
