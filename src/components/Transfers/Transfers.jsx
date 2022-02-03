import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, useHistory, generatePath, Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import format from 'date-fns/format';
import queryString from 'query-string';

import { pages } from '../../constans/location';

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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

import { dateFormate } from '../../constans/settings';
import { useStyles } from './Transfers.styles';

import { ref, getDatabase, orderByChild } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../firebaseInit';
import { Typography } from '@mui/material';

const database = getDatabase(firebaseApp);

const headCell = [
  { id: 'date', labelI18nKey: 'Transfers.tablehead.date' },
  { id: 'player', labelI18nKey: 'Transfers.tablehead.player' },
  { id: 'givingClub', labelI18nKey: 'Transfers.tablehead.givingClub' },
  { id: 'recivingClub', labelI18nKey: 'Transfers.tablehead.recivingClub' },
  { id: 'endDate', labelI18nKey: 'Transfers.tablehead.endDate' },
];

function TransfersTableRows(props) {
  const {
    t,
    transfers,
    players,
    images,
    clubs,
    classes,
    history,
  } = props;

  return (
    <TableBody>
      {transfers.map(([ key, transfer ]) => {
        const {
          date,
          player,
          fromClub,
          toClub,
          endDate,
        } = transfer;

        const {
          lastName: playerLastName,
          firstName: playerFirstName,
          photo: playerPhoto,
        } = players[player];
        const {
          photo: fromClubPhoto,
          shortName: fromClubShortName,
        } = clubs[fromClub];
        const {
          photo: toClubPhoto,
          shortName: toClubShortName,
        } = clubs[toClub];

        return (
          <TableRow
            hover
            key={key}
          >
            <TableCell>
              <IconButton
                onClick={() => history.push(generatePath(pages.TRANSFER_INFO, { id: transfer }))}
                aria-label='edit'
              >
                <EditIcon/>
              </IconButton>
            </TableCell>
            <TableCell>
              {!endDate ? (
                t('Transfers.tablecell.atDate', { date: format(date, dateFormate) })
              ) : (
                t('Transfers.tablecell.fromDate', { date: format(date, dateFormate) })
              )}
            </TableCell>
            <TableCell>
              <Link
                to={generatePath(pages.PLAYER_INFO, { id: player })}
                onClick={e => e.stopPropagation()}
                className={classes.avatarLink}
              >
                <Avatar
                  alt={playerLastName}
                  src={playerPhoto && images[playerPhoto] && images[playerPhoto].downloadURL}
                />
                <div>
                  <Typography variant='body2' component='div'>
                    {playerFirstName}
                  </Typography>
                  <Typography variant='body2' component='div'>
                    {playerLastName}
                  </Typography>
                </div>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                to={generatePath(pages.CLUB_INFO, { id: fromClub })}
                onClick={e => e.stopPropagation()}
                className={classes.avatarLink}
              >
                <Avatar
                  alt={fromClubShortName}
                  src={fromClubPhoto && images[fromClubPhoto] && images[fromClubPhoto].downloadURL}
                />
                <Typography variant='body2' component='div'>
                  {fromClubShortName}
                </Typography>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                to={generatePath(pages.CLUB_INFO, { id: toClub })}
                onClick={e => e.stopPropagation()}
                className={classes.avatarLink}
              >
                <Avatar
                  alt={toClubShortName}
                  src={toClubPhoto && images[toClubPhoto] && images[toClubPhoto].downloadURL}
                />
                <Typography variant='body2' component='div'>
                  {toClubShortName}
                </Typography>
              </Link></TableCell>
              <TableCell>{endDate && t('Transfers.tablecell.toDate', { date: format(endDate, dateFormate) })}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}

const ROWS_PER_PAGE = [10, 25, 50];

const filterMap = {
  type: 'type',
  name: 'name',
};
const transferTypeMap = {
  transfer: 'transfer',
  loan: 'loan',
};

function stableSort(obj, cmp, players) {
  let result = Object.entries(obj);

  let defaultCMP = true;

  if (cmp[filterMap.type]) {
    const shouldBeLoan = cmp[filterMap.type] === transferTypeMap.loan;

    result = result
      .filter(([, transfer]) => (shouldBeLoan ? !transfer.endDate : transfer.endDate));

    defaultCMP = false;
  }

  if (cmp[filterMap.name]) {
    result = result
      .filter(([, transfer]) => {
        const player = players[transfer.player];
        const searchString = `${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`;

        return searchString.includes(cmp[filterMap.name].toLowerCase());
      });

    defaultCMP = false;
  }

  if (defaultCMP) {
    result = result.reverse();
  }

  return result;
}

function TransfersFilter(props) {
  const {
    t,
    searchParams,
    changeFilterHandler,
    handleChangePage,
  } = props;
  const changeInputHandler = name => event => {
    changeFilterHandler(name, event.target.value);
    handleChangePage(event, 0);
  };

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
        <FormControl
          fullWidth
          variant='filled'
          size='small'
        >
          <InputLabel id='license-type-select'>{t('Transfers.filter.type')}</InputLabel>
          <Select
            labelId='license-type-select'
            id={filterMap.type}
            value={searchParams[filterMap.type] || ''}
            onChange={changeInputHandler(filterMap.type)}
          >
            <MenuItem value={''}>{t('Transfers.filter.all')}</MenuItem>,
            <MenuItem value={transferTypeMap.transfer}>{t('Transfers.filter.loan')}</MenuItem>,
            <MenuItem value={transferTypeMap.loan}>{t('Transfers.filter.transfer')}</MenuItem>,
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
          label={t('Transfers.filter.player')}
          onChange={changeInputHandler(filterMap.name)}
        />
      </Grid>
    </Grid>
  );
}

function TransfersList() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [snapshotTransfers, loadingTransfers, errorTransfers] = useObject(ref(database, 'transfers'), orderByChild('date'));
  const [snapshotClubs, loadingClubs, errorClubs] = useObject(ref(database, 'clubs'));
  const [snapshotPlayers, loadingImages, errorImages] = useObject(ref(database, 'players'));
  const [snapshotImages, loadingPlayers, errorPlayers] = useObject(ref(database, 'images'));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWS_PER_PAGE[0]);

  if (loadingTransfers || loadingClubs || loadingPlayers || loadingImages) {
    return <LinearProgress/>;
  }

  if (errorTransfers || errorClubs || errorPlayers || errorImages) {
    return <div>Error: {errorTransfers || errorClubs || errorPlayers || errorImages}</div>;
  }

  const { location, replace } = history;

  let searchParams = queryString.parse(location.search);

  const transfers = snapshotTransfers.val();
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

  const transfersRows = stableSort(transfers, searchParams, players);

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

  return (
    <Grid>
      <Helmet>
        <title>{t('Players.list.title')}</title>
      </Helmet>
      <TransfersFilter
        t={t}
        searchParams={searchParams}
        changeFilterHandler={setFilterLocation}
        handleChangePage={handleChangePage}
      />
      <Paper
        className={classes.tableWrapper}
      >
        <TableContainer>
          <Table
            aria-labelledby='tableTitle'
            aria-label='transfers table'
          >
            <TableHead>
              <TableRow>
                <TableCell key={-1}/>
                {headCell.map(headCell => (
                  <TableCell
                    key={headCell.id}
                  >
                    {t(headCell.labelI18nKey)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TransfersTableRows
              transfers={
                transfersRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              }
              clubs={clubs}
              players={players}
              images={images}
              translator={t}
              classes={classes}
              t={t}
              history={history}
            />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE}
          component='div'
          count={transfersRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Grid>
  );
}

export default function Transfers() {
  return (
    <Switch>
      <Route exact path={pages.TRANSFERS}>
        <TransfersList/>
      </Route>
      <Route path={pages.TRANSFER_EDIT}>
        <div>Edit transfer</div>
      </Route>
    </Switch>
  );
}
