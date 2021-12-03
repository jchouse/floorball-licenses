import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, generatePath } from 'react-router-dom';
import queryString from 'query-string';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';
import cn from 'classnames';
import Helmet from 'react-helmet';

import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { clubsListDropdown } from '../Clubs/ClubsListDropdown/ClubsListDropdown';

import { pages } from '../../constans/location';
import {
  dateFormate,
  activeSeason,
} from '../../constans/settings';
import { useStyles } from './Players.styles';

import { ref, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../firebaseInit';

const database = getDatabase(firebaseApp);
const NOW = new Date;

const headCell = [
  { id: 'license', labelI18nKey: 'Players.table.license' },
  { id: 'club', labelI18nKey: 'Players.table.club' },
  { id: 'photo', labelI18nKey: 'Players.table.photo' },
  { id: 'firstName', labelI18nKey: 'Players.table.firstName' },
  { id: 'lastName', labelI18nKey: 'Players.table.lastName' },
  { id: 'gender', labelI18nKey: 'Players.gender.header' },
  { id: 'age', labelI18nKey: 'Players.table.age' },
];

export const gendersMap = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
};

function PlayersTableRows(props) {
  const {
    players,
    clubs,
    images,
    classes,
    handleClick,
    handleClubClick,
    translator,
  } = props;

  const genderMap = {
    [gendersMap.MALE]: translator('Players.gender.MALE'),
    [gendersMap.FEMALE]: translator('Players.gender.FEMALE'),
  };

  return (
    <TableBody>
      {players.map(([ key, player ]) => {
        const {
          license,
          firstClub,
          currentClub,
          firstName,
          lastName,
          born,
          photo: playerPhoto,
          endActivationDate,
          gender,
        } = player;

        let club = firstClub;

        if (currentClub) {
          club = currentClub;

        }

        const playersClub = clubs[club];

        const {
          photo: clubsLogo,
          shortName,
        } = playersClub;
        const isExpired = endActivationDate <= activeSeason.startDate;

        return (
          <TableRow
            hover
            classes={{ root: cn({ [classes.disabledRow]: isExpired }) }}
            onClick={event => handleClick(event, key)}
            key={key}
          >
            <TableCell>{license}</TableCell>
            <TableCell>
              <div
                className={classes.clubLogoCell}
              >
                <Avatar
                  className={classes.clubLogo}
                  alt={shortName}
                  src={clubsLogo && images[clubsLogo] && images[clubsLogo].downloadURL}
                />
                <Link
                  onClick={event => handleClubClick(event, club)}
                >{shortName}</Link>
              </div>
            </TableCell>
            <TableCell>
              <Avatar
                alt={`${firstName} ${lastName}`}
                src={playerPhoto && images[playerPhoto] && images[playerPhoto].downloadURL}
              />
            </TableCell>
            <TableCell>{firstName}</TableCell>
            <TableCell>{lastName}</TableCell>
            <TableCell>{genderMap[gender]}</TableCell>
            <TableCell>
              {`${differenceInYears(NOW, born)} (${format(born, dateFormate)})`}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}

const filterMap = {
  license: 'license',
  licenseType: 'licenseType',
  name: 'name',
  club: 'club',
  gender: 'gender',
  age: 'age',
  expired: 'expired',
};

function PlayersFilter(props) {
  const {
    translator,
    changeFilterHandler,
    searchParams,
    handleChangePage,
    clubs,
  } = props;
  const changeInputHandler = name => event => {
    changeFilterHandler(name, event.target.value);
    handleChangePage(event, 0);
  };
  const changeSwitchHandler = name => event => {
    changeFilterHandler(name, event.target.checked);
    handleChangePage(event, 0);
  };
  const clubsItems = React.useMemo(() => clubsListDropdown(clubs), [clubs]);

  return (
    <Grid
      container
      alignItems='flex-end'
      spacing={2}
    >
      <Grid
        md={1}
        item
      >
        <TextField
          fullWidth
          color='primary'
          type='number'
          variant='filled'
          size='small'
          value={searchParams[filterMap.license] || ''}
          id={filterMap.license}
          label={translator('Players.table.license')}
          onChange={changeInputHandler(filterMap.license)}
        />
      </Grid>
      <Grid
        md={1}
        item
      >
        <FormControl
          fullWidth
          variant='filled'
          size='small'
        >
          <InputLabel id='license-type-select'>{translator('Players.license.type')}</InputLabel>
          <Select
            labelId='license-type-select'
            id={filterMap.licenseType}
            value={searchParams[filterMap.licenseType] || ''}
            onChange={changeInputHandler(filterMap.licenseType)}
          >
            {[
              <MenuItem key={-1} value={''}>{translator('Players.filter.all')}</MenuItem>,
              activeSeason.possibleLiciensies.map(license => (
                <MenuItem key={license.value} value={license.value}>{license.name}</MenuItem>
              )),
            ]}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        md={2}
        item
      >
        <TextField
          fullWidth
          variant='filled'
          size='small'
          value={searchParams[filterMap.name] || ''}
          color='primary'
          id={filterMap.name}
          label={translator('Players.name')}
          onChange={changeInputHandler(filterMap.name)}
        />
      </Grid>
      <Grid
        md={2}
        item
      >
        <FormControl
          fullWidth
          variant='filled'
          size='small'
        >
          <InputLabel id='club-select'>{translator('Players.enterClub')}</InputLabel>
          <Select
            labelId='clubs-select'
            id={filterMap.club}
            value={searchParams[filterMap.club] || ''}
            onChange={changeInputHandler(filterMap.club)}
          >
            <MenuItem value={''}>{translator('Players.filter.all')}</MenuItem>
            {clubsItems.map(club => (
              <MenuItem key={club.value} value={club.value}>{club.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        md={1}
        item
      >
        <FormControl
          fullWidth
          variant='filled'
          size='small'
        >
          <InputLabel id='gender-select'>{translator('Players.gender.header')}</InputLabel>
          <Select
            labelId='gender-select'
            id={filterMap.gender}
            value={searchParams[filterMap.gender] || ''}
            onChange={changeInputHandler(filterMap.gender)}
          >
            <MenuItem value={''}>{translator('Players.filter.all')}</MenuItem>
            {Object.entries(gendersMap).map(([key]) => (
              <MenuItem key={key} value={key}>{translator(`Players.gender.${key}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        md={1}
        item
      >
        <TextField
          fullWidth
          variant='filled'
          size='small'
          value={searchParams[filterMap.age] || ''}
          type='number'
          id={filterMap.age}
          label={translator('Players.table.age')}
          onChange={changeInputHandler(filterMap.age)}
        />
      </Grid>
      <Grid
        md={2}
        item
      >
        <FormControlLabel
          control={
            <Switch
              name={filterMap.expired}
              color='primary'
              checked={!!searchParams[filterMap.expired]}
              value={searchParams[filterMap.expired]}
              onChange={changeSwitchHandler(filterMap.expired)}
            />
          }
          label={translator('Players.filter.unactive')}
        />
      </Grid>
    </Grid>
  );
}

function stableSort(players, comparator) {
  let result = Object.entries(players);

  if (comparator[filterMap.license]) {
    result = result
      .filter(([, player]) => player.license.toString().includes(comparator[filterMap.license].toString()));
  }

  if (comparator[filterMap.licenseType]) {
    result = result
      .filter(([, player]) => player.licenseType === comparator[filterMap.licenseType]);
  }

  if (comparator[filterMap.name]) {
    result = result
      .filter(([, player]) => {
        const searchString = `${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`;

        return searchString.includes(comparator[filterMap.name].toLowerCase());
      });
  }

  if (comparator[filterMap.club]) {
    result = result
      .filter(([, player]) => player.currentClub === comparator[filterMap.club]);
  }

  if (comparator[filterMap.gender]) {
    result = result
      .filter(([, player]) => player.gender === comparator[filterMap.gender]);
  }

  if (comparator[filterMap.age]) {
    result = result
      .filter(([, player]) => differenceInYears(NOW, parseInt(player.born)) <= parseInt(comparator[filterMap.age]));
  }

  if (!comparator[filterMap.expired]) {
    result = result
      .filter(([, player]) => player.lastActiveSeason >= activeSeason.startDate && player.lastActiveSeason <= activeSeason.endDate);
  }

  return result;
}

const ROWS_PER_PAGE = [10, 25, 50];

export default function Players() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [snapshotClubs, loadingClubs, errorClubs] = useObject(ref(database, 'clubs'));
  const [snapshotPlayers, loadingImages, errorImages] = useObject(ref(database, 'players'));
  const [snapshotImages, loadingPlayers, errorPlayers] = useObject(ref(database, 'images'));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWS_PER_PAGE[0]);

  if (loadingClubs || loadingPlayers || loadingImages) {
    return <LinearProgress/>;
  }

  if (errorClubs || errorPlayers || errorImages) {
    return <div>Error: {errorClubs || errorPlayers || errorImages}</div>;
  }

  const { location, replace, push } = history;

  let searchParams = queryString.parse(location.search);

  const clubs = snapshotClubs.val();
  const players = snapshotPlayers.val();
  const images = snapshotImages.val();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClubClick = (event, key) => {
    event.stopPropagation();

    push(generatePath(pages.CLUB_INFO, { id: key }));
  };

  const handlePlayerRowClick = (event, key) => {
    event.stopPropagation();

    push(generatePath(pages.PLAYER_INFO, { id: key }));
  };

  const setFilterLocation = (name, value) => {
    if (value) {
      searchParams = {
        ...searchParams,
        [`${name}`]: value,
      };
    } else if (searchParams[name]) {
      delete searchParams[name];
    }

    const stringified = queryString.stringify(searchParams);

    replace(`${location.pathname}?${stringified}`);
  };

  const playersRows = stableSort(players, searchParams);

  return (
      <Grid>
        <Helmet>
          <title>{t('Players.list.title')}</title>
        </Helmet>
        <PlayersFilter
          translator={t}
          searchParams={searchParams}
          changeFilterHandler={setFilterLocation}
          handleChangePage={handleChangePage}
          clubs={clubs}
          images={images}
        />
        <Paper>
          <TableContainer>
            <Table
              aria-labelledby='tableTitle'
              aria-label='players table'
            >
              <TableHead>
                <TableRow>
                  {headCell.map(headCell => (
                    <TableCell
                      key={headCell.id}
                    >
                      {t(headCell.labelI18nKey)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <PlayersTableRows
                players={
                  playersRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                }
                translator={t}
                clubs={clubs}
                images={images}
                classes={classes}
                handleClubClick={handleClubClick}
                handleClick={handlePlayerRowClick}
              />
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE}
            component='div'
            count={playersRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
  );
}
