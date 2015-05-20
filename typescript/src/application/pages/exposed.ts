
module KCW {

    var clickCount = 0;

    /**
     * 第二艦隊の状態表示のための狗肉の策
     */
    export function onClickForCombinedShipsStatus() {
        clickCount++;
        if (clickCount > 1) {
            setTimeout(() => {
                // TODO: #532
                KCW.ShipsStatusWindow.show({left: -52, panel: 2});
            }, 1600);
            $('embed').attr('onmousedown', '');
            clickCount = 0;
            KCW.sendMessageToContentScript({purpose:'unbindOnClick'});
        }
    }

    export function sendMessageToContentScript(msg: any) {
        chrome.tabs.query({url:'http://osapi.dmm.com/gadgets/ifr*'}, function(tabs) {
            if (!tabs || tabs.length == 0) {
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, msg);
        });
    }
}