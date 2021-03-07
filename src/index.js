import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { addLocaleData } from 'react-intl';
import uk from 'react-intl/locale-data/uk';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import firebase from 'firebase';
import firebaseConfig from './firebaseVars';
import { CookiesProvider } from 'react-cookie';
import Floorball from './components/Floorball/Floorball.jsx';
import Clubs from './components/Clubs/Clubs.jsx';
import ClubCard from './components/Clubs/Club/Club.jsx';
import EditClubCard from './components/Clubs/Club/Edit/Edit.jsx';
import Players from './components/Players/Players.jsx';
import PlayerCard from './components/Players/Player/Player.jsx';
import EditPlayerCard from './components/Players/Player/Edit/Edit.jsx';
import Transfers from './components/Transfers/Transfers.jsx';
import TransfersEdit from './components/Transfers/Edit/TransfersEdit.jsx';
import Info from './components/Info/Info.jsx';
import Account from './components/Account/Account.jsx';
// import Requests from './components/Requests/Requests.jsx';
// import NewRequest from './components/Requests/New/NewRequest.jsx';
import floorballApp from './reducers/reducers';
import './index.css';
import WebFontLoader from 'webfontloader';
import { createBrowserHistory } from 'history';

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons']
    }
});

/* eslint-disable one-var */
// Initialize firebase instance
firebase.initializeApp(firebaseConfig[process.env.REACT_APP_FIREBASE_CONFIG]);

// Create store with reducers and initial state
const initialState = {};
const store = createStore(floorballApp, initialState);

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, store);

// react-redux-firebase config
const rrfConfig ={

};

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch
};
/* eslint-enable one-var */

addLocaleData(uk);

// TODO: Temporary Component
class NotFound extends Component {
    render() {
        return <h2>Воу воу полегче, еще не написали :)</h2>;
    }
}

render (
    <Provider store={store}>
        <CookiesProvider>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <Router history={history}>
                    <Floorball>
                        <Switch>
                            <Route path='/clubs/:id/edit' component={EditClubCard}/>
                            <Route path='/clubs/:id' component={ClubCard}/>
                            <Route path='/clubs' component={Clubs}/>

                            <Route path='/players/:id/edit' component={EditPlayerCard}/>
                            <Route path='/players/:id' component={PlayerCard}/>
                            <Route path='/players' component={Players}/>

                            <Route path='/transfers/:id/edit' component={TransfersEdit}/>
                            <Route path='/transfers' component={Transfers}/>

                            <Route path='/your-account' component={Account}/>

                            {/* <Route path='/requests' component={Requests}/> */}
                            {/* <Route path='/requests/new' component={NewRequest}/> */}

                            <Route exact path='/' component={Info}/>

                            <Route path='*' component={NotFound}/>
                        </Switch>
                    </Floorball>
                </Router>
            </ReactReduxFirebaseProvider>
        </CookiesProvider>
    </Provider>,
    document.getElementById('root')
);
