import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import { createStore } from 'redux'
import PopupView from './Components/Views/PopupView';

let store = createStore((state = {}, action) => {
  return state;
})

render(
  <MuiThemeProvider store={store}>
    <PopupView />
  </MuiThemeProvider>,
  document.getElementById('main')
);
