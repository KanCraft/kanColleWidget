import React                from "react";
import {render}             from "react-dom";
import MuiThemeProvider     from "material-ui/styles/MuiThemeProvider";
import getMuiTheme          from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import PopupView from "../../Application/Views/Popup/PopupView";

import { init } from "../global-pollution";
init(window);

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <PopupView context={window} />
  </MuiThemeProvider>,
  document.getElementById("main")
);
