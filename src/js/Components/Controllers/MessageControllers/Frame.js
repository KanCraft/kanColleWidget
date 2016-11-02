import Frame from "../../Models/Frame";

export function GetAllFrames(/* message */) {
    return Frame.all();
}

export function SaveNewFrame(message) {
    let frame = new Frame({
        id: message.id,
        alias: message.alias,
        size: message.size,
        url: message.url,
        protected: message.protected,
        decoration: message.decoration
    });
    frame.save();
    return {created:Frame.find(message.id)};
}

export function DeleteFrame(message) {
    let frame = Frame.find(message._id);
    frame.delete();
    return {};
}
