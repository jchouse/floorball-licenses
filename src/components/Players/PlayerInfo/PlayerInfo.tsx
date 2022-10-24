import React from 'react';
import { useParams, useHistory, generatePath } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';
import cs from 'classnames';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import SpeedDial from '@mui/material/SpeedDial';
import EditIcon from '@mui/icons-material/Edit';

import { ITransfer } from '../../Transfers/Transfers';

import { pages } from '../../../constans/location';
import { Roles, dateFormate } from '../../../constans/settings';

import { useStyles } from './PlayerInfo.styles';

import { IPlayer } from '../Players';
import { IClub } from '../../Clubs/Clubs';
import { IImage } from '../../FileUploader/FileUploader';

const NOW = new Date();

interface IClubLinkProps {
  clubId: string;
  clubs: Record<string, IClub>;
  images: Record<string, IImage>;
  classes: ReturnType<typeof useStyles>;
  history: ReturnType<typeof useHistory>;
}

function ClubLink(props: IClubLinkProps) {
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

  const handleClubClick = (event: React.SyntheticEvent, key: string) => {
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

interface IPlayerInfoProps {
  clubs: Record<string, IClub>;
  images: Record<string, IImage>;
  players: Record<string, IPlayer>;
  transfers: Record<string, ITransfer>;
  role: Roles;
}

export default function PlayerInfo({ clubs, images, players, transfers, role }: IPlayerInfoProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { push } = history;

  const handleClubClick = React.useCallback((event, key) => {
    event.stopPropagation();

    push(generatePath(pages.CLUB_INFO, { id: key }));
  }, [push]);

  const handleEditPlayerClick  = React.useCallback((event) => {
    push(generatePath(pages.EDIT_PLAYER, { id }));
  } , [push, id]);

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
    endActivationDate,
  } = players[id];
  const logo = images[photo] && images[photo].downloadURL;

  const playersTransfers = Object.entries(transfers)
    .filter(([, transfer]) => transfer.player === id)
    .sort(([, transferA], [, transferB]) => transferA.date - transferB.date);

  const { photo: currentClubPhoto, shortName: currentClubShortName } = clubs[currentClub || firstClub];
  const { photo: firstClubPhoto, shortName: firstClubShortName } = clubs[firstClub];

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
        item
        xs={10}
        md={3}
        lg={3}
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
              className={classes.currentClubLogo}
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
        xs={10}
        md={7}
        lg={7}
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
      {role === Roles.ADMIN && (
        <SpeedDial
          onClick={handleEditPlayerClick}
          ariaLabel={t('Floorball.editPlayer')}
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<EditIcon/>}
        />
      )}
    </Grid>
  );
}
