import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import { addLocaleData } from 'react-intl';
import uk from 'react-intl/locale-data/uk';

import firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './firebaseVars';

import { CookiesProvider } from 'react-cookie';

import Floorball from './components/Floorball/Floorball.jsx';

import floorballApp from './reducers/reducers';

import './index.css';
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

const reactReduxFirebaseConfig = {};

firebase.initializeApp(firebaseConfig[process.env.REACT_APP_FIREBASE_CONFIG]);

const store = createStore(floorballApp);
const reactReduxFirebaseProps = {
  firebase,
  config: reactReduxFirebaseConfig,
  dispatch: store.dispatch,
};

addLocaleData(uk);

render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...reactReduxFirebaseProps}>
      <CookiesProvider>
        <Router>
          <Floorball/>
        </Router>
      </CookiesProvider>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);
