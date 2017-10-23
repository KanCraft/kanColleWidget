import Streaming from "../../../Services/Streaming";

export function OnAllContextClicked(/* info, tab */) {
  Streaming.instance().then(streaming => {
    let params = new URLSearchParams();
    params.set("src", streaming.toBlobURL());
    window.open("/dest/html/stream.html" + "?" + params.toString());
  });
}
