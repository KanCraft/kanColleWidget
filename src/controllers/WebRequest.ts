import { Logger, Router } from "chromite";

const onBeforeRequest = new Router<chrome.webRequest.WebRequestBodyEvent>(async (details) => {
    (new Logger("WebRequest")).debug("onBeforeRequest", details);
    return { __action__: "/test" };
});

export { onBeforeRequest };
