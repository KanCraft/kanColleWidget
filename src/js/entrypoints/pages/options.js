import React from "react";
import { render } from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import OptionsView from "../../Components/Views/Options";

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <OptionsView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
