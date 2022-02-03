import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LinearProgress from '@mui/material/LinearProgress';

import ClubsList from './ClubsList/ClubsList';
import ClubInfo from './ClubInfo/ClubInfo';
import EditClubInfo from '../Clubs/EditClubInfo/EditClubInfo';

import { ref, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../firebaseInit';

import { pages } from '../../constans/location';
import { RolesContext } from '../RolesContext/RolesContext';

const database = getDatabase(firebaseApp);

export interface IClub {
  email: string;
  fullNameInt: string;
  fullName: string;
  phone: string;
  photo: string;
  shortNameInt: string;
  shortName: string;
  url: string;
  city: string;
  line: string;
  postCode: string;
  country: string;
  region: string;
  founded: number;
  added: number;
}

export default function Clubs() {
  const [snapshotClubs, loadingClubs, errorClubs] = useObject(ref(database, 'clubs'));
  const [snapshotImages, loadingImages, errorImages] = useObject(ref(database, 'images'));
  const { role } = React.useContext(RolesContext);

  useObject(ref(database, 'counters'));


  if (loadingClubs || loadingImages) {
    return <LinearProgress/>;
  }

  if (errorClubs || errorImages) {
    return <div>Error: {errorClubs || errorImages}</div>;
  }

  const clubs = snapshotClubs?.val();
  const images = snapshotImages?.val();

  return (
    <Switch>
      <Route exact path={pages.CLUBS}>
        <ClubsList
          images={images}
          clubs={clubs}
        />
      </Route>
      <Route path={pages.EDIT_CLUB}>
        <EditClubInfo
          images={images}
          clubs={clubs}
        />
      </Route>
      <Route path={pages.CLUB_INFO}>
        <ClubInfo
          images={images}
          clubs={clubs}
          role={role}
        />
      </Route>
    </Switch>
  );
}
