import React    from "react";
import {render} from "react-dom";

import MuiThemeProvider    from "material-ui/styles/MuiThemeProvider";
import getMuiTheme          from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import { init } from "../global-pollution";
init(window);

import {Client} from "chomex";

import DashboardView from "../../Application/Views/Dashboard";

const client = new Client(chrome.runtime);
setInterval(() => {
  client.message("/launchposition/dashboard/update", {
    height: window.outerHeight,
    width:  window.outerWidth,
    left:   window.screenX,
    top:    window.screenY,
  });
}, 60 * 1000);

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <DashboardView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
