import React from "react";
import Scrap from "../../Models/Scrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import WindowService from "../../../Services/Window";

class ScrapCell extends React.Component<{
  scrap: Scrap,
}, {}> {
  render() {
    const { scrap } = this.props;
    return (
      <div className="column col-4">
        <div className="card">
          <div className="card-image">
            <img src={scrap.url} className="img-responsive" />
          </div>
          <div className="card-footer">
            <button className="btn btn-primary float-right">
              <FontAwesomeIcon icon={faEdit} onClick={() => {
                WindowService.getInstance().openCapturePage({ url: scrap.url, filename: scrap.name });
              }} />
            </button>
            {scrap.name}
          </div>
        </div>
      </div>
    );
  }
}
export default class ArchiveView extends React.Component<{}, {
  scraps: Scrap[],
}> {
  constructor(props) {
    super(props);
    this.state = {
      scraps: Scrap.list(),
    };
  }
  render() {
    const { scraps } = this.state;
    return (
      <div className="container">
        <div className="columns">
          {scraps.map(scrap => <ScrapCell key={scrap._id} scrap={scrap} />)}
        </div>
        <div className="columns">
          <div className="column">TOTAL: {scraps.length}</div>
        </div>
      </div>
    );
  }
}