import { Routes, Route } from 'react-router-dom';

import { pages } from '../../constans/location';

import { ref, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../firebaseInit';
import { db_paths } from '../../db/db_constans';

import LinearProgress from '@mui/material/LinearProgress';

import TransfersEdit from './TransfersEdit/TransfersEdit';
import TransfersList from './TransfersList/TransfersList';

const database = getDatabase(firebaseApp);

export interface ITransfer {
  date: number;
  endDate?: number;
  fromClub: string;
  player: string;
  toClub: string;
  countryIsoCode?: string;
  toClubName?: string;
}

export default function Transfers() {
  const [snapshotTransfers, loadingTransfers, errorTransfers] = useObject(ref(database, db_paths.Transfers));
  const [snapshotClubs, loadingClubs, errorClubs] = useObject(ref(database, db_paths.Clubs));
  const [snapshotPlayers, loadingImages, errorImages] = useObject(ref(database, db_paths.Players));
  const [snapshotImages, loadingPlayers, errorPlayers] = useObject(ref(database, db_paths.Images));

  if (loadingTransfers || loadingClubs || loadingPlayers || loadingImages) {
    return <LinearProgress/>;
  }

  if (errorTransfers || errorClubs || errorPlayers || errorImages) {
    return <div>Error: {errorTransfers || errorClubs || errorPlayers || errorImages}</div>;
  }

  const transfers = snapshotTransfers?.val();
  const clubs = snapshotClubs?.val();
  const players = snapshotPlayers?.val();
  const images = snapshotImages?.val();

  return (
    <Routes>
      <Route
        index
        element={
          <TransfersList
            transfers={transfers}
            clubs={clubs}
            players={players}
            images={images}
          />
        }
      />
      <Route
        path={pages.TRANSFER_EDIT}
        element={
          <TransfersEdit
            transfers={transfers}
            clubs={clubs}
            players={players}
          />
        }
      />
    </Routes>
  );
}
