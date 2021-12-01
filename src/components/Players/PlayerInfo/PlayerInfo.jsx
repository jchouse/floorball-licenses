import React from 'react';
import { useParams, useHistory, generatePath } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';
import cs from 'classnames';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import { pages } from '../../../constans/location';
import { dateFormate } from '../../../constans/settings';

import { useStyles } from './PlayerInfo.styles';

import { ref, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../../firebaseInit';

const database = getDatabase(firebaseApp);
const NOW = new Date;

function ClubLink(props) {
  const {
    clubId,
    clubs,
    images,
    classes,
    history,
  } = props;
  const { push } = history;
  const club = clubs[clubId];
  const {
    shortName,
    photo,
  } = club;

  const handleClubClick = (event, key) => {
    event.stopPropagation();

    push(generatePath(pages.CLUB_INFO, { id: key }));
  };

  return (
    <div
      className={classes.clubLogoWrapper}
      onClick={event => handleClubClick(event, clubId)}
    >
      <Avatar
        className={classes.clubLogo}
        alt={shortName}
        src={images[photo] && images[photo].downloadURL}
      />
    </div>
  );
}

export default function PlayerInfo() {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const { push } = history;
  const [snapshotClubs, loadingClubs, errorClubs] = useObject(ref(database, 'clubs'));
  const [snapshotPlayers, loadingImages, errorImages] = useObject(ref(database, 'players'));
  const [snapshotImages, loadingPlayers, errorPlayers] = useObject(ref(database, 'images'));
  const [snapshotTransfers, loadingTransfers, errorTransfers] = useObject(ref(database, 'transfers'));

  const handleClubClick = React.useCallback((event, key) => {
    event.stopPropagation();

    push(generatePath(pages.CLUB_INFO, { id: key }));
  }, []);

  if (loadingClubs || loadingPlayers || loadingImages || loadingTransfers) {
    return <LinearProgress/>;
  }

  if (errorClubs || errorPlayers || errorImages || errorTransfers) {
    return <div>Error: {errorClubs || errorPlayers || errorImages || errorTransfers}</div>;
  }

  const clubs = snapshotClubs.val();
  const players = snapshotPlayers.val();
  const images = snapshotImages.val();
  const transfers = snapshotTransfers.val();

  const {
    firstName,
    lastName,
    secondName,
    photo,
    license,
    licenseType,
    born,
    citizenship,
    firstNameInt,
    lastNameInt,
    height,
    weight,
    position,
    side,
    gender,
    firstClub,
    registrDate,
    currentClub,
  } = players[id];
  const logo = images[photo] && images[photo].downloadURL;

  const playersTransfers = Object.entries(transfers)
    .filter(([, transfer]) => transfer.player === id)
    .sort(([, transferA], [, transferB]) => transferA.date - transferB.date);

  const { photo: currentClubPhoto, shortName: currentClubShortName } = clubs[currentClub];
  const { photo: firstClubPhoto, shortName: firstClubShortName } = clubs[firstClub];

  console.log(players[id]);

  return (
    <Grid
      container
      justifyContent='center'
      spacing={2}
    >
      <Helmet>
        <title>{`${firstName} ${lastName}`}</title>
      </Helmet>
      <Grid
        container
        alignItems='flex-start'
        item
        xs={8}
      >
        <Grid
          item
          xs={4}
          container
          direction='column'
          spacing={1}
          alignContent='flex-start'
        >
          <Grid
            item
            className={classes.photoWrapper}
          >
            <div
              className={cs(classes.clubLogoWrapper, classes.currentClubLogoWrapper)}
              onClick={event => handleClubClick(event, currentClub)}
            >
              <Avatar
                className={cs(classes.clubLogo, classes.currentClubLogo)}
                alt={currentClubShortName}
                src={images[currentClubPhoto] && images[currentClubPhoto].downloadURL}
              />
            </div>
            <Grid item className={classes.logoWrapper}>
              <img className={classes.logo} src={logo} alt={`${lastName} ${firstName}`}/>
            </Grid>
          </Grid>
          <Grid
            item
          >
            <Grid>
              <Typography variant='h6' align='center' className={classes.transferHeader}>
                {t('Players.homeClub')}
              </Typography>
            </Grid>
            <div className={classes.transferRow}>
              <div
                className={classes.clubLogoWrapper}
                onClick={event => handleClubClick(event, firstClub)}
              >
                <Avatar
                  className={classes.clubLogo}
                  alt={firstClubShortName}
                  src={images[firstClubPhoto] && images[firstClubPhoto].downloadURL}
                />
              </div>
              <div className={classes.transferText}>
                <div className={classes.transferTextRow}>
                  <Typography variant='body1' className={classes.transferText}>
                    {format(registrDate, dateFormate)}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          {playersTransfers.length > 0 && (
            <div>
              <Typography variant='h6' align='center' className={classes.transferHeader}>
                {t('Players.transfersAndLoans')}
              </Typography>
              {playersTransfers.map(([key, transfer]) => {
                const {
                  fromClub,
                  toClub,
                  date,
                  endDate,
                } = transfer;

                return (
                  <div
                    key={key}
                    className={classes.transferRow}
                  >
                    <ClubLink
                      clubId={fromClub}
                      clubs={clubs}
                      images={images}
                      classes={classes}
                      history={history}
                    />
                    {endDate ? (
                      <div className={classes.transferText}>
                        <div className={classes.transferTextRow}>
                          {`${t('Players.from')} ${format(date, dateFormate)}`}
                        </div>
                        <div className={classes.transferTextRow}>
                          {`${t('Players.to')} ${format(endDate, dateFormate)}`}
                        </div>
                      </div>
                    ) : (
                      <div className={classes.transferText}>
                        <div className={classes.transferTextRow}>
                          {`${t('Players.at')} ${format(date, dateFormate)}`}
                        </div>
                      </div>
                    )}
                    <ClubLink
                      clubId={toClub}
                      clubs={clubs}
                      images={images}
                      classes={classes}
                      history={history}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Grid>
        <Grid
          item
          xs={8}
          container
          direction='column'
          spacing={1}
        >
          <Grid item>
            <Typography variant='subtitle1'>
              {t('Players.license.header')}
            </Typography>
            <Typography variant='h6'>
              {license}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='subtitle1'>
              {t('Players.license.type')}
            </Typography>
            <Typography variant='h6'>
              {t(`Players.license.${licenseType}`)}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='subtitle1'>
              {t('Players.name')}
            </Typography>
            <Typography variant='h6'>
              {t(`${lastName} ${firstName} ${secondName}`)}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='subtitle1'>
              {`${t('Players.table.age')} (${t('Players.born.label')})`}
            </Typography>
            <Typography variant='h6'>
              {`${differenceInYears(NOW, born)} (${format(born, dateFormate)})`}
            </Typography>
          </Grid>
          {citizenship && (
            <Grid item>
              <Typography variant='subtitle1'>
                {t('Players.citizenship.label')}
              </Typography>
              <Typography variant='h6'>
                {citizenship}
              </Typography>
            </Grid>
          )}
          {(firstNameInt || lastNameInt) && (
            <Grid item>
              <Typography variant='subtitle1'>
                {t('Players.nameEN')}
              </Typography>
              <Typography variant='h6'>
                {`${lastNameInt} ${firstNameInt}`}
              </Typography>
            </Grid>
          )}
          {height && (
            <Grid item>
              <Typography variant='subtitle1'>
                {t('Players.height.header')}
              </Typography>
              <Typography variant='h6'>
                {t('Players.height.num', { height })}
              </Typography>
            </Grid>
          )}
          {weight && (
            <Grid item>
              <Typography variant='subtitle1'>
                {t('Players.weight.header')}
              </Typography>
              <Typography variant='h6'>
                {t('Players.weight.num', { weight })}
              </Typography>
            </Grid>
          )}
          {position && (
            <Grid item>
              <Typography variant='subtitle1'>
                {t('Players.position.header')}
              </Typography>
              <Typography variant='h6'>
                {t(`Players.position.${position}`)}
              </Typography>
            </Grid>
          )}
          {side && (
            <Grid item>
              <Typography variant='subtitle1'>
                {t('Players.side.header')}
              </Typography>
              <Typography variant='h6'>
                {t(`Players.side.${side}`)}
              </Typography>
            </Grid>
          )}
          {gender && (
            <Grid item>
              <Typography variant='subtitle1'>
                {t('Players.gender.header')}
              </Typography>
              <Typography variant='h6'>
                {t(`Players.gender.${gender}`)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
