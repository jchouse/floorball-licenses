import React from 'react';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';

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

import { dateFormate } from '../../constans/settings';
import { useStyles } from './Transfers.styles';

import { ref, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../firebaseInit';

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
          photo: playerPhoto,
        } = players[player];

        return (
          <TableRow key={key}>
            <TableCell>
              {!endDate ? (
                t('Transfers.tablecell.atDate', { date: format(date, dateFormate) })
              ) : (
                t('Transfers.tablecell.fromDate', { date: format(date, dateFormate) })
              )}
            </TableCell>
            <TableCell>
              <Avatar
                alt={playerLastName}
                src={playerPhoto && images[playerPhoto] && images[playerPhoto].downloadURL}
              />
              <Link to='#'>{playerLastName}</Link>
            </TableCell>
            <TableCell>{fromClub}</TableCell>
            <TableCell>{toClub}</TableCell>
            <TableCell>{endDate}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}

function stableSort(obj) {
  const result = Object.entries(obj);

  return result;
}

const ROWS_PER_PAGE = [10, 25, 50];

export default function Transfers() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [snapshotTransfers, loadingTransfers, errorTransfers] = useObject(ref(database, 'transfers'));
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

  const transfersRows = stableSort(transfers);

  return (
    <Grid>
      <Helmet>
        <title>{t('Players.list.title')}</title>
      </Helmet>
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
              // handleClubClick={handleClubClick}
              // handleClick={handlePlayerRowClick}
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
