import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

import LinearProgress from '@mui/material/LinearProgress';

import PlayersList from './PlayersList/PlayersList';
import PlayerInfo from './PlayerInfo/PlayerInfo';
import PlayerInfoEdit from './PlayerInfoEdit/PlayerInfoEdit';

import { ref, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../firebaseInit';

import { pages } from '../../constans/location';
import { RolesContext } from '../RolesContext/RolesContext';

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
  endActivationDate: number;
  lastActiveSeason?: string;
  currentClub: string;
  uniqueExternId: string;
}

export default function Players() {
  const [snapshotClubs, loadingClubs, errorClubs] = useObject(ref(database, 'clubs'));
  const [snapshotPlayers, loadingImages, errorImages] = useObject(ref(database, 'players'));
  const [snapshotImages, loadingPlayers, errorPlayers] = useObject(ref(database, 'images'));
  const [snapshotTransfers, loadingTransfers, errorTransfers] = useObject(ref(database, 'transfers'));
  const [snapshotCounters, loadingCounters, errorCounters] = useObject(ref(database, 'counters'));
  const { role } = useContext(RolesContext);

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

  return (
    <Switch>
      <Route exact path={pages.PLAYERS}>
        <PlayersList
          players={players}
          images={images}
          clubs={clubs}
        />
      </Route>
      <Route path={pages.EDIT_PLAYER}>
        <PlayerInfoEdit
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
