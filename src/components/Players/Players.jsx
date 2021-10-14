import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { useTranslation } from 'react-i18next';
import { useHistory, generatePath } from 'react-router-dom';
import queryString from 'query-string';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';
import cn from 'classnames';

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

import { clubsListDropdown } from '../Clubs/ClubsListDropdown/ClubsListDropdown';

import { pages } from '../../constans/location';
import {
  bornDateFormate,
  activeSeason,
} from '../../constans/settings';
import { useStyles } from './Players.styles';

const NOW = new Date;

const populates = [{ child: 'photo', root: 'images' }];

const enhance = compose(
  firebaseConnect(() => ([
    { path: 'players', populates },
    { path: 'clubs', populates },
  ])),
  connect(props => {
    const { firebase } = props;

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
          endActivationDate,
        } = player;
        const playersClub = clubs[club];

        const {
          photo: {
            downloadURL: clubsLogo,
          },
          shortNameUA,
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
              {`${differenceInYears(NOW, born)} (${format(born, bornDateFormate)})`}
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
    handleChangePage,
    clubs,
  } = props;
  const changeInputHandler = name => event => {
    changeFilterHandler(name, event.target.value);
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
          value={searchParams[filterMap.license] || ''}
          type='number'
          color='primary'
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
        >
          <InputLabel id='license-type-select'>{translator('Players.enterClub')}</InputLabel>
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
        <TextField
          fullWidth
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
              checked={searchParams[filterMap.expired]}
              value={searchParams[filterMap.expired]}
              onChange={changeSwitchHandler(filterMap.expired)}
            />
          }
          label={translator('Players.filter.unactive')}
        />
      </Grid>
    </Grid>
  );
};

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
        const searchString = `${player.firstNameUA.toLowerCase()}${player.lastNameUA.toLowerCase()}`;

        return searchString.includes(comparator[filterMap.name].toLowerCase());
      });
  }

  if (comparator[filterMap.club]) {
    result = result
      .filter(([, player]) => player.club === comparator[filterMap.club]);
  }

  if (comparator[filterMap.age]) {
    result = result
      .filter(([, player]) => differenceInYears(NOW, parseInt(player.born)) <= parseInt(comparator[filterMap.age]));
  }

  if (!comparator[filterMap.expired]) {
    result = result
      .filter(([, player]) => player.endActivationDate >= activeSeason.startDate && player.endActivationDate <= activeSeason.endDate);
  }

  return result;
}

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

  let searchParams = queryString.parse(location.search);

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
        <PlayersFilter
          translator={t}
          searchParams={searchParams}
          changeFilterHandler={setFilterLocation}
          handleChangePage={handleChangePage}
          clubs={clubs}
        />
        <Paper
          className={classes.tableWrapper}
        >
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
