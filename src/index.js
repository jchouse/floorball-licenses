import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import { addLocaleData } from 'react-intl';
import uk from 'react-intl/locale-data/uk';
import { reactReduxFirebase } from 'react-redux-firebase';
import firebase from 'firebase';
import firebaseConfig from './firebaseVars';
import { CookiesProvider } from 'react-cookie';
import Floorball from './blocks/Floorball/Floorball.jsx';
import Clubs from './blocks/Clubs/Clubs.jsx';
import ClubCard from './blocks/Clubs/Club/Club.jsx';
import EditClubCard from './blocks/Clubs/Club/Edit/Edit.jsx';
import Players from './blocks/Players/Players.jsx';
import PlayerCard from './blocks/Players/Player/Player.jsx';
import EditPlayerCard from './blocks/Players/Player/Edit/Edit.jsx';
import Transfers from './blocks/Transfers/Transfers.jsx';
import TransfersEdit from './blocks/Transfers/Edit/TransfersEdit.jsx';
import Info from './blocks/Info/Info.jsx';
import Account from './blocks/Account/Account.jsx';
import Requests from './blocks/Requests/Requests.jsx';
import NewRequest from './blocks/Requests/New/NewRequest.jsx';
import floorballApp from './reducers/reducers';
import './index.css';
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons']
    }
});

/* eslint-disable one-var */
firebase.initializeApp(firebaseConfig[process.env.REACT_APP_FIREBASE_CONFIG]);

const config = {};

const createStoreWithFirebase = compose(reactReduxFirebase(firebase, config))(createStore);

const store = createStoreWithFirebase(floorballApp);

const history = syncHistoryWithStore(browserHistory, store);

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
            <Router history={history}>
                <Route path='/' component={Floorball}>
                    <IndexRoute component={Info}/>
                    <Route path='clubs'>
                        <IndexRoute component={Clubs}/>
                        <Route path=':id' component={ClubCard}/>
                        <Route path=':id/edit' component={EditClubCard}/>
                    </Route>
                    <Route path='players'>
                        <IndexRoute component={Players}/>
                        <Route path=':id' component={PlayerCard}/>
                        <Route path=':id/edit' component={EditPlayerCard}/>
                    </Route>
                    <Route path='transfers'>
                        <IndexRoute component={Transfers}/>
                        <Route path=':id/edit' component={TransfersEdit}/>
                    </Route>
                    <Route path='your-account' component={Account}/>
                    <Route path='requests'>
                        <IndexRoute component={Requests}/>
                        <Route path='new' component={NewRequest}/>
                    </Route>
                </Route>
                <Route path='*' component={NotFound}/>
            </Router>
        </CookiesProvider>
    </Provider>,
    document.getElementById('root')
);
