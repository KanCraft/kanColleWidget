import React    from "react";
import {render} from "react-dom";
import MuiThemeProvider     from "material-ui/styles/MuiThemeProvider";
import getMuiTheme          from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import FeedbackView from "../../Application/Views/Feedback";

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <FeedbackView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
