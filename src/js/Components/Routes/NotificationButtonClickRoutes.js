import {Router} from "chomex";

let router = new Router(id => {
    const [name, ] = id.split(".");
    return {name};
});

router.on("mission", (id) => {
    chrome.notifications.clear(id);
    window.open("https://github.com/otiai10/kanColleWidget/wiki/遠征IDが知らない子と言われたとき");
});

const NotificationButtonClickListener = router.listener();
export default NotificationButtonClickListener;
