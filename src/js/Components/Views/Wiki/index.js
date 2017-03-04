import React, {Component} from "react";

import {Tabs, Tab} from "material-ui/Tabs";
import MissionsWikiView from "./MissionsWiki";
import RemodelsWikiView from "./RemodelsWiki";

const styles = {
  contents: {
    padding: "32px"
  }
};

export default class WikiView extends Component {
  render() {
    return (
      <Tabs>
        <Tab label="遠征早見表">
          <div style={styles.contents}>
            <MissionsWikiView />
          </div>
        </Tab>
        <Tab label="改修工廠早見表">
          <div style={styles.contents}>
            <RemodelsWikiView />
          </div>
        </Tab>
      </Tabs>
    );
  }
}
