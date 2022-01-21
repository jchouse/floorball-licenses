import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LinearProgress from '@mui/material/LinearProgress';

import PlayersList from './PlayersList/PlayersList';
import PlayerInfo from './PlayerInfo/PlayerInfo';
import EditPlayerInfo from './EditPlayerInfo/EditPlayerInfo';

import { ref, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../firebaseInit';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

import { pages } from '../../constans/location';
import { Roles } from '../../constans/settings';

const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

export interface IPlayer {
  born: number;
  citizenship: string;
  firstClub: string;
  firstNameInt: string;
  firstName: string;
  gender: string;
  height: string;
  lastNameInt: string;
  lastName: string;
  license: number;
  licenseType: string;
  photo: string;
  position: string;
  registrDate: number;
  side: string;
  secondName: string;
  weight: string;
  lastTransfer: string;
  lastActiveSeason: number;
  currentClub: string;
  uniqueExternId: string;
}

export default function Players() {
  const [snapshotClubs, loadingClubs, errorClubs] = useObject(ref(database, 'clubs'));
  const [snapshotPlayers, loadingImages, errorImages] = useObject(ref(database, 'players'));
  const [snapshotImages, loadingPlayers, errorPlayers] = useObject(ref(database, 'images'));
  const [snapshotTransfers, loadingTransfers, errorTransfers] = useObject(ref(database, 'transfers'));
  const [snapshotCounters, loadingCounters, errorCounters] = useObject(ref(database, 'counters'));
  const [snapshotUsers] = useObject(ref(database, 'users'));
  const [user] = useAuthState(auth);

  if (loadingClubs || loadingPlayers || loadingImages || loadingTransfers || loadingCounters) {
    return <LinearProgress/>;
  }

  if (errorClubs || errorPlayers || errorImages || errorTransfers || errorCounters) {
    return <div>Error: {errorClubs || errorPlayers || errorImages || errorTransfers}</div>;
  }

  const clubs = snapshotClubs?.val();
  const players = snapshotPlayers?.val();
  const images = snapshotImages?.val();
  const transfers = snapshotTransfers?.val();
  const counters = snapshotCounters?.val();
  const users = snapshotUsers?.val();

  let role = Roles.GUEST;

  if (user && users?.[user.uid]) {
    role = users[user.uid].role > 90 ? Roles.ADMIN : Roles.USER;
  }

  return (
    <Switch>
      <Route exact path={pages.PLAYERS}>
        <PlayersList
          players={players}
          images={images}
          clubs={clubs}
        />
      </Route>
      <Route path={pages.EDIT_PLAYERS}>
        <EditPlayerInfo
          players={players}
          images={images}
          clubs={clubs}
          counter={counters.playerID}
        />
      </Route>
      <Route path={pages.PLAYER_INFO}>
        <PlayerInfo
          players={players}
          images={images}
          clubs={clubs}
          transfers={transfers}
          role={role}
        />
      </Route>
    </Switch>
  );
}
