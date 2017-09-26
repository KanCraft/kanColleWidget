import React    from "react";
import {render} from "react-dom";
import MuiThemeProvider    from "material-ui/styles/MuiThemeProvider";
import getMuiTheme          from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import ManualTimerView from "../../Application/Views/ManualTimer";

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <ManualTimerView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
