import React from "react";
import Scrap from "../../Models/Scrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import WindowService from "../../../Services/Window";

class ScrapCell extends React.Component<{
  scrap: Scrap | any,
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
  scraps: (Scrap | any)[],
}> {
  constructor(props) {
    super(props);
    this.state = {
      // scraps: Scrap.list(),
      scraps: [
        {
          _id: "1",
          filename: "scrap-1597107177930.png",
          name: "E7-2-1",
          created: 1597107177992,
          url: "https://user-images.githubusercontent.com/931554/82826950-ff3cd700-9ee8-11ea-927a-05f3881de75f.png",
        },
        {
          _id: "2",
          filename: "scrap-1597107177930.png",
          name: "E7-2-1",
          created: 1597107177992,
          url: "https://user-images.githubusercontent.com/931554/82826950-ff3cd700-9ee8-11ea-927a-05f3881de75f.png",
        },
        {
          _id: "3",
          filename: "scrap-1597107177930.png",
          name: "E7-2-1",
          created: 1597107177992,
          url: "https://user-images.githubusercontent.com/931554/82826950-ff3cd700-9ee8-11ea-927a-05f3881de75f.png",
        },
        {
          _id: "4",
          filename: "scrap-1597107177930.png",
          name: "E7-2-1",
          created: 1597107177992,
          url: "https://user-images.githubusercontent.com/931554/82826950-ff3cd700-9ee8-11ea-927a-05f3881de75f.png",
        },
        {
          _id: "5",
          filename: "scrap-1597107177930.png",
          name: "E7-2-1",
          created: 1597107177992,
          url: "https://user-images.githubusercontent.com/931554/82826950-ff3cd700-9ee8-11ea-927a-05f3881de75f.png",
        }
      ]
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