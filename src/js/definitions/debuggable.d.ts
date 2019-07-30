declare interface DebuggableResponse extends chrome.webRequest.WebResponseCacheDetails {
    debug?: any;
}

declare interface DebuggableRequest extends chrome.webRequest.WebRequestBodyDetails {
    debug?: any;
}
