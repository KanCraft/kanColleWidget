import React, {Component} from "react";
import HTTPClient from "../../../Services/API/HTTPClient";
import CircularProgress from "material-ui/CircularProgress";

export default class MissionsWikiView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: null,
            loader: <CircularProgress style={{width:"100%", textAlign:"center", marginTop:"20%"}}/>,
        };
        this.http = new HTTPClient();
        this.http.html("http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC").then(res => {
            var tmp = document.implementation.createHTMLDocument(); tmp.body.innerHTML = res.response;
            return Promise.resolve(tmp);
        }).then(document => {
            let table = document.querySelector("h2#h2_content_1_4").nextElementSibling.nextElementSibling.querySelector("table");
            this.setState({
                table: <table style={{width: "100%", margin: "0 auto"}} dangerouslySetInnerHTML={{__html: table.innerHTML}}></table>,
                loader: null,
            });
        });
    }
    render() {
        const url = "http://wikiwiki.jp/kancolle/?遠征#houshuu";
        return (
          <div>
            <div>
              <span>出典: <a href="http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC#houshuu">{url}</a></span>
              {this.state.loader}
              {this.state.table}
            </div>
          </div>
        );
    }
}
