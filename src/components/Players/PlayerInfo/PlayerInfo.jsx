import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { useParams, useHistory, generatePath } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import { pages } from '../../../constans/location';
import { bornDateFormate } from '../../../constans/settings';

import { useStyles } from './PlayerInfo.styles';

const NOW = new Date;

const populates = [
  { child: 'photo', root: 'images' },
  { child: 'lastTransfer', root: 'transfers' },
];

const enhance = compose(
  firebaseConnect([
    { path: 'players', populates },
    { path: 'transfers', populates },
    { path: 'clubs', populates },
  ]),
  connect(({ firebase }) => ({
    players: populate(firebase, 'players', populates),
    transfers: populate(firebase, 'transfers', populates),
    clubs: populate(firebase, 'clubs', populates),
  }))
);

function clubLink(clubId, clubs) {
  const classes = useStyles();
  const history = useHistory();
  const { push } = history;
  const club = clubs[clubId];
  const {
    shortName,
    photo: {
      downloadURL,
    },
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
        src={downloadURL}
      />
    </div>
  );
}

function PlayerInfo(props) {
  const { players, clubs, transfers } = props;

  if (!isLoaded(players) || !isLoaded(clubs) || !isLoaded(transfers)) {
    return <LinearProgress/>;
  }

  const { t } = useTranslation();
  const classes = useStyles();
  const { id } = useParams();

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
  } = players[id];
  const logo = photo && photo.downloadURL;

  const playersTransfers = Object.entries(transfers).filter(([, transfer]) => transfer.player === id);

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
          >
            <Grid item className={classes.logoWrapper}>
              <img className={classes.logo} src={logo} alt={`${lastName} ${firstName}`}/>
            </Grid>
          </Grid>
          <Grid
            item
          >
            <Typography variant='h6'>
              {t('Players.homeClub')}
            </Typography>
            <Grid
              container
              spacing={1}
              alignContent='center'
            >
              {clubLink(firstClub, clubs)}
              <Typography variant='body'  className={classes.transferText}>
                {format(registrDate, bornDateFormate)}
              </Typography>
            </Grid>
          </Grid>
          {playersTransfers.length > 0 && (
            <Grid item>
              <Typography variant='h6'>
                {t('Players.transfers')}
              </Typography>
              <Grid
                container
                spacing={1}
                alignContent='center'
                justifyContent='space-between'
              >
                {playersTransfers.map(([key, transfer]) => {
                  const {
                    fromClub,
                    toClub,
                    date,
                  } = transfer;

                  return (
                    <Grid
                      key={key}
                      item
                      container
                      spacing={2}
                    >
                      <Grid item>
                        {clubLink(fromClub, clubs)}
                      </Grid>
                      <Grid item>
                        <Typography variant='body' className={classes.transferText}>
                          {'→'}
                        </Typography>
                      </Grid>
                      <Grid item>
                        {clubLink(toClub, clubs)}
                      </Grid>
                      <Grid item>
                        <Typography variant='body' className={classes.transferText}>
                          {format(date, bornDateFormate)}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
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
              {`${differenceInYears(NOW, born)} (${format(born, bornDateFormate)})`}
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

export default enhance(PlayerInfo);
