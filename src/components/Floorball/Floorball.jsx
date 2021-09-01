import React from 'react';
import { useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import intlData from '../../intl/Intl';

import Header from '../Header/Header.jsx';
import Clubs from '../Clubs/Clubs.jsx';
import ClubCard from '../Clubs/Club/Club.jsx';
import EditClubCard from '../Clubs/Club/Edit/Edit.jsx';
import Players from '../Players/Players.jsx';
import PlayerCard from '../Players/Player/Player.jsx';
import EditPlayerCard from '../Players/Player/Edit/Edit.jsx';
import Transfers from '../Transfers/Transfers.jsx';
import TransfersEdit from '../Transfers/Edit/TransfersEdit.jsx';
import Account from '../Account/Account.jsx';
import Requests from '../Requests/Requests.jsx';
import NewRequest from '../Requests/New/NewRequest.jsx';

export default function Floorball() {
  const locale = useSelector(state => state.locale);

function NotFound() {
  return <h2>Воу воу полегче, еще не написали :)</h2>;
}

  return (
    <IntlProvider locale={locale} messages={intlData[locale]}>
      <div>
        <Header/>
        <Switch>
          <Route exact path='/'>
            <Redirect to='clubs'/>
          </Route>
          <Route path='/clubs' component={Clubs}>
            <Route path=':id' component={ClubCard}/>
            <Route path=':id/edit' component={EditClubCard}/>
          </Route>
          <Route path='players' component={Players}>
            <Route path=':id' component={PlayerCard}/>
            <Route path=':id/edit' component={EditPlayerCard}/>
          </Route>
          <Route path='transfers' component={Transfers}>
            <Route path=':id/edit' component={TransfersEdit}/>
          </Route>
          <Route path='your-account' component={Account}/>
          <Route path='requests' component={Requests}>
            <Route path='new' component={NewRequest}/>
          </Route>
          <Route path='*'>
            <NotFound/>
          </Route>
        </Switch>
      </div>
    </IntlProvider>
  );
}
