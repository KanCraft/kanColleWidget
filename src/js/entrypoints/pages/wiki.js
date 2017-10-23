import React    from "react";
import {render} from "react-dom";

import MuiThemeProvider     from "material-ui/styles/MuiThemeProvider";
import getMuiTheme          from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import WikiView from "../../Application/Views/Wiki";

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <WikiView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
