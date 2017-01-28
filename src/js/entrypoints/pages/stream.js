import React from "react";
import { render } from "react-dom";
// import { Provider } from "react-redux"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import { init } from "../global-pollution";
init(window);

import StreamView from "../../Components/Views/Stream";

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <StreamView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
