import React from "react";
import { render } from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import  ScrapBookView from "../../Components/Views/ScrapBook";

import { init } from "../global-pollution";
init(window);

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <ScrapBookView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
