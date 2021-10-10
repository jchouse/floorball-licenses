import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { useTranslation } from 'react-i18next';
import { useHistory, generatePath } from 'react-router-dom';
import queryString from 'query-string';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import { pages } from '../../constans/location';
import * as dateFormas from '../../constans/dateFormats';
import { useStyles } from './Players.styles';

const populates = [{ child: 'photo', root: 'images' }];

const enhance = compose(
  firebaseConnect(props => {
    console.log('firebaseConnect props', props);

    return [
      { path: 'players', populates },
      { path: 'clubs', populates },
    ];
  }),
  connect(props => {
    const { firebase } = props;

    console.log('connect props', props);

    return {
      players: populate(firebase, 'players', populates),
      clubs: populate(firebase, 'clubs', populates),
    };
  }),
);

const headCell = [
  { id: 'license', labelI18nKey: 'Players.table.license' },
  { id: 'club', labelI18nKey: 'Players.table.club' },
  { id: 'photo', labelI18nKey: 'Players.table.photo' },
  { id: 'firstName', labelI18nKey: 'Players.table.firstName' },
  { id: 'lastName', labelI18nKey: 'Players.table.lastName' },
  { id: 'age', labelI18nKey: 'Players.table.age' },
];

const PlayersTableHead = (function PlayersTableHead({ translator }) {
  return (
    <TableHead>
      <TableRow>
        {headCell.map(headCell => (
          <TableCell
            key={headCell.id}
          >
            {translator(headCell.labelI18nKey)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
});

const PlayersTableRows = React.memo(function PlayersTableRows(props) {
  const {
    players,
    clubs,
    classes,
    handleClick,
    handleClubClick,
  } = props;

  return (
    <TableBody>
      {players.map(([ key, player ]) => {
        const {
          license,
          club,
          firstNameUA,
          lastNameUA,
          born,
          photo: userPhoto,
        } = player;
        const playersClub = clubs[club];
        const {
          photo: {
            downloadURL: clubsLogo,
          },
          shortNameUA,
        } = playersClub;

        return (
          <TableRow
            hover
            onClick={event => handleClick(event, key)}
            key={key}
          >
            <TableCell>{license}</TableCell>
            <TableCell>
              <div
                className={classes.clubLogoCell}
                onClick={event => handleClubClick(event, club)}
              >
                <Avatar
                  className={classes.clubLogo}
                  alt={shortNameUA}
                  src={clubsLogo}
                />
                <Link href='#'>{shortNameUA}</Link>
              </div>
            </TableCell>
            <TableCell>
              <Avatar
                alt={`${firstNameUA} ${lastNameUA}`}
                src={userPhoto && userPhoto.downloadURL}
              />
            </TableCell>
            <TableCell>{firstNameUA}</TableCell>
            <TableCell>{lastNameUA}</TableCell>
            <TableCell>
              {`${differenceInYears(new Date, born)} (${format(born, dateFormas.bornDate)})`}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
});

const filterMap = {
  license: 'license',
  licenseType: 'licenseType',
  name: 'name',
  club: 'club',
  age: 'age',
  expired: 'expired',
};

const PlayersFilter = props => {
  const {
    translator,
    changeFilterHandler,
    searchParams,
  } = props;

  const changeInputHandler = name => event => {
    changeFilterHandler(name, event.target.value);
  };

  return (
    <Grid
      container
      alignItems='flex-start'
      spacing={2}
    >
      <Grid
        item
      >
        <TextField
          value={searchParams[filterMap.license] || ''}
          type='number'
          color='primary'
          id={filterMap.license}
          label={translator('Players.table.license')}
          onChange={changeInputHandler(filterMap.license)}
        />
      </Grid>
      <Grid
        item
      >
        <FormControl>
          <InputLabel id='license-type-select'>{translator('Players.license.type')}</InputLabel>
          <Select
            labelId='license-type-select'
            id={filterMap.licenseType}
            value={searchParams[filterMap.licenseType] || ''}
            onChange={changeInputHandler(filterMap.licenseType)}
          >
            <MenuItem value={''}>{translator('Players.filter.all')}</MenuItem>
            <MenuItem value={'Adult_A'}>{translator('Players.license.Adult_A')}</MenuItem>
            <MenuItem value={'Adult_B'}>{translator('Players.license.Adult_B')}</MenuItem>
            <MenuItem value={'Junior_A'}>{translator('Players.license.Junior_A')}</MenuItem>
            <MenuItem value={'Junior_B'}>{translator('Players.license.Junior_B')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid
        item
      >
        <TextField
          value={searchParams[filterMap.name] || ''}
          color='primary'
          id={filterMap.name}
          label={translator('Players.name')}
          onChange={changeInputHandler(filterMap.name)}
        />
      </Grid>
      <Grid
        item
      >
        <FormControl>
          <InputLabel id='license-type-select'>{translator('Players.license.type')}</InputLabel>
          <Select
            labelId='clubs-select'
            id={filterMap.club}
            // value={age}
            // onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid
        item
      >
        <TextField
          type='number'
          id={filterMap.age}
          label={translator('Players.table.age')}
        />
      </Grid>
      <Grid>
        <FormControlLabel
          control={
            <Switch
              // checked={state.checkedB}
              // onChange={handleChange}
              name={filterMap.expired}
              color='primary'
            />
          }
          label={translator('Players.filter.unactive')}
        />
      </Grid>
    </Grid>
  );
};

const ROWS_PER_PAGE = [10, 25, 50];

const Players = props => {
  const {
    players,
    clubs,
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { location, replace, push } = history;
  const searchParams = queryString.parse(location.search);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWS_PER_PAGE[0]);

  if (!isLoaded(players) || !isLoaded(clubs)) {
    return <LinearProgress/>;
  }

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

  const playersRows = Object.entries(players);

  const setFilterLocation = (name, value) => {
    const stringified = queryString.stringify({
      ...searchParams,
      [`${name}`]: value,
    });

    replace(`${location.pathname}?${stringified}`);
  };

  return (
      <Grid>
        <PlayersFilter
          translator={t}
          searchParams={searchParams}
          changeFilterHandler={setFilterLocation}
        />
        <Paper>
          <TableContainer>
            <Table
              aria-labelledby='tableTitle'
              aria-label='players table'
            >
              <PlayersTableHead
                translator={t}
              />
              <PlayersTableRows
                players={
                  playersRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                }
                clubs={clubs}
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
};

export default enhance(Players);
