import React, {Component} from "react";
import HTTPClient from "../../../Services/API/HTTPClient";
import CircularProgress from "material-ui/CircularProgress";

export default class RemodelsWikiView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: null,
            loader: <CircularProgress style={{width:"100%", textAlign:"center", marginTop:"20%"}}/>,
        };
        this.http = new HTTPClient();
        this.http.html("http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3").then(res => {
            var tmp = document.implementation.createHTMLDocument(); tmp.body.innerHTML = res.response;
            return Promise.resolve(tmp);
        }).then(document => {
            let table = document.querySelector("h3#h3_content_1_15").nextElementSibling.querySelector("table");
            this.setState({
                table: <table style={{width: "100%", margin: "0 auto"}} dangerouslySetInnerHTML={{__html: table.innerHTML}}></table>,
                loader: null,
            });
        });
    }
    render() {
        let url = "http://wikiwiki.jp/kancolle/?改修工廠#s_kaisyu";
        return (
          <div>
            <div>
              <span>出典: <a href="http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3#s_kaisyu">{url}</a></span>
              {this.state.loader}
              {this.state.table}
            </div>
          </div>
        );
    }
}
