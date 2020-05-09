export interface DebuggableResponse extends chrome.webRequest.WebResponseCacheDetails {
    debug?: any;
}
export interface DebuggableRequest extends chrome.webRequest.WebRequestBodyDetails {
    debug?: any;
}