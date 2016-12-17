import React from "react";
import { render } from "react-dom";
// import { Provider } from "react-redux"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import { createStore } from "redux";

import { init } from "../global-pollution";
init(window);

import {Client} from "chomex";

import DashboardView from "../../Components/Views/Dashboard";

// Redux使うかもな
let store = createStore((state = {} /*, action */) => {
    return state;
});

const client = new Client(chrome.runtime);
setInterval(() => {
    client.message("/launchposition/dashboard/update", {
        left: window.screenX,
        top:  window.screenY,
    });
}, 60 * 1000);

render(
  <MuiThemeProvider store={store} muiTheme={getMuiTheme()}>
    <DashboardView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
