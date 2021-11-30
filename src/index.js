import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import './i18n';

// import { initializeApp } from 'firebase/app';
// import 'firebase/auth';
// import firebaseConfig from './firebaseVars';

import Floorball from './components/Floorball/Floorball.jsx';

// import floorballApp from './reducers/reducers';

import WebFontLoader from 'webfontloader';
WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

render(
  <CookiesProvider>
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Floorball/>
      </ThemeProvider>
    </Router>
  </CookiesProvider>,
  document.getElementById('root')
);
