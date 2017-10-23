import Frame from "../../Models/Frame";

export function GetAllFrames(/* message */) {
  return Frame.all();
}

export function SaveNewFrame(message) {
  let frame = new Frame({
    id:         message.id,
    alias:      message.alias,
    size:       message.size,
    position:   message.position,
    zoom:       message.zoom,
    url:        message.url,
    protected:  message.protected,
    decoration: message.decoration,
    addressbar: message.addressbar,
  });
  frame.save();
  return {created:Frame.find(message.id)};
}

export function UpdateFrame(message) {
  let frame = Frame.find(message.frame._id);
  frame.alias      = message.frame.alias;
  frame.position   = message.frame.position;
  frame.size       = message.frame.size;
  frame.zoom       = parseFloat(message.frame.zoom);
  frame.addressbar = !!message.frame.addressbar;
  frame.save();
  return frame;
}

export function DeleteFrame(message) {
  let frame = Frame.find(message._id);
  frame.delete();
  return {};
}
