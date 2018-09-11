
export async function OnPort(req: chrome.webRequest.WebRequestBodyDetails) {
  /* tslint:disable no-console */
  console.log("on port", req);
}
