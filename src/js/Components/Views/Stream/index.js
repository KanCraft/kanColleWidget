import React, {Component} from "react";

export default class StreamView extends Component {
    render() {
        let url = new URL(location.href);
        return (
          <div>
            <video width="840" height="400" src={url.searchParams.get("src")} autoPlay="true"/>
          </div>
        );
    }
}
