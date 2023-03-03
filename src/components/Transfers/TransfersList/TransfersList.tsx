import React, { useCallback, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, generatePath, Link, useLocation } from 'react-router-dom';
import format from 'date-fns/format';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Avatar from '@mui/material/Avatar';
import TablePagination from '@mui/material/TablePagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';

import { styled } from '@mui/material/styles';

import { pages } from '../../../constans/location';
import { Roles, dateFormate } from '../../../constans/settings';
import { RolesContext } from '../../RolesContext/RolesContext';
import { ITransfer } from '../Transfers';
import { IPlayer } from '../../Players/Players';
import { IClub } from '../../Clubs/Clubs';
import { IImage } from '../../FileUploader/FileUploader';

const headCell = [
  { id: 'date', labelI18nKey: 'Transfers.tablehead.date' },
  { id: 'player', labelI18nKey: 'Transfers.tablehead.player' },
  { id: 'givingClub', labelI18nKey: 'Transfers.tablehead.givingClub' },
  { id: 'recivingClub', labelI18nKey: 'Transfers.tablehead.recivingClub' },
  { id: 'endDate', labelI18nKey: 'Transfers.tablehead.endDate' },
];

const ROWS_PER_PAGE = [10, 25, 50];

const StyledAvatarLink = styled(Link)({
  display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
});

enum ETransferTypes {
  loan = 'loan',
  transfer = 'transfer',
}

enum ETransferFiltersTypes {
  type = 'type',
  name = 'name',
};

function stableSort(obj: Record<string, ITransfer>, cmp: URLSearchParams, players: Record<string, IPlayer>) {
  let result = Object.entries(obj);

  let defaultCMP = true;

  if (cmp.get(ETransferFiltersTypes.type)) {
    result = result
      .filter(([, transfer]) => (cmp.get(ETransferFiltersTypes.type) === ETransferTypes.loan ? transfer.endDate : !transfer.endDate));

    defaultCMP = false;
  }

  if (cmp.get(ETransferFiltersTypes.name)) {
    const searchName = cmp.get(ETransferFiltersTypes.name)?.toLowerCase() || '';
  
    result = result
      .filter(([, transfer]) => {
        const player = players[transfer.player];

        if (!player) {
          return false;
        }

        const searchString: string = `${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`;

        return searchString.includes(searchName);
      });

    defaultCMP = false;
  }

  if (defaultCMP) {
    result = result.reverse();
  }

  return result;
}

interface ITransfersListProps {
  transfers: Record<string, ITransfer>;
  players: Record<string, IPlayer>;
  clubs: Record<string, IClub>;
  images: Record<string, IImage>;
}

export default function TransfersList(props: ITransfersListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWS_PER_PAGE[0]);
  const { role } = useContext(RolesContext);
  const { transfers, players, clubs, images } = props;

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    document.title = t('Transfers.title');
  }, [t]);

  const setFilterLocation = useCallback(
    (name: string, value: string) => {
      if (value) {
        searchParams.set(name, value);
      } else if (searchParams.get(name)) {
        searchParams.delete(name);
      }

      const stringified = searchParams.toString();

      navigate(`${location.pathname}?${stringified}`, { replace: true });
    },
    [location, navigate, searchParams]
  );

  const changeInputFilterHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFilterLocation(ETransferFiltersTypes.name, event.target.value);
      handleChangePage(null, 0);
    }, 
    [setFilterLocation]
  );

  const selectFilterHandler = useCallback(
    (event: SelectChangeEvent) => {
      setFilterLocation(ETransferFiltersTypes.type, event.target.value as string);
      handleChangePage(null, 0);
    },
    [setFilterLocation]
  );

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const transfersRows = stableSort(transfers, searchParams, players);

  return (
    <Grid>
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
              id={ETransferFiltersTypes.type}
              value={searchParams.get(ETransferFiltersTypes.type) || ''}
              onChange={selectFilterHandler}
            >
              <MenuItem value={''}>{t('Transfers.filter.all')}</MenuItem>,
              <MenuItem value={ETransferTypes.loan}>{t('Transfers.filter.loan')}</MenuItem>,
              <MenuItem value={ETransferTypes.transfer}>{t('Transfers.filter.transfer')}</MenuItem>,
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
            value={searchParams.get(ETransferFiltersTypes.name) || ''}
            color='primary'
            id={ETransferFiltersTypes.name}
            label={t('Transfers.filter.player')}
            onChange={changeInputFilterHandler}
          />
        </Grid>
      </Grid>
      <Paper>
        <TableContainer>
          <Table
            aria-labelledby='tableTitle'
            aria-label='transfers table'
          >
            <TableHead>
              <TableRow>
                {role === Roles.ADMIN && <TableCell key={-1}/>}
                {headCell.map(headCell => (
                  <TableCell
                    key={headCell.id}
                  >
                    {t(headCell.labelI18nKey)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transfersRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(([ key, transfer ]: [ string, ITransfer]) => {
                  const {
                    date,
                    player,
                    fromClub,
                    toClub,
                    endDate,
                  } = transfer;

                  if (!players[player] || !clubs[fromClub] || !clubs[toClub]) {
                    return null;
                  }
          
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
                      {role === Roles.ADMIN && <TableCell>
                        <IconButton
                          onClick={() => navigate(generatePath(`${pages.TRANSFERS}/${pages.TRANSFER_EDIT}`, { id: key }))}
                          aria-label='edit'
                        >
                          <EditIcon/>
                        </IconButton>
                      </TableCell>}
                      <TableCell>
                        {!endDate ? (
                          t('Transfers.tablecell.atDate', { date: format(date, dateFormate) })
                        ) : (
                          t('Transfers.tablecell.fromDate', { date: format(date, dateFormate) })
                        )}
                      </TableCell>
                      <TableCell>
                        <StyledAvatarLink
                          to={generatePath(`${pages.PLAYERS}/${pages.PLAYER_INFO}`, { id: player })}
                          onClick={e => e.stopPropagation()}
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
                        </StyledAvatarLink>
                      </TableCell>
                      <TableCell>
                        <StyledAvatarLink
                          to={generatePath(`${pages.CLUBS}/${pages.CLUB_INFO}`, { id: fromClub })}
                          onClick={e => e.stopPropagation()}
                        >
                          <Avatar
                            alt={fromClubShortName}
                            src={fromClubPhoto && images[fromClubPhoto] && images[fromClubPhoto].downloadURL}
                          />
                          <Typography variant='body2' component='div'>
                            {fromClubShortName}
                          </Typography>
                        </StyledAvatarLink>
                      </TableCell>
                      <TableCell>
                        <StyledAvatarLink
                          to={generatePath(`${pages.CLUBS}/${pages.CLUB_INFO}`, { id: toClub })}
                          onClick={e => e.stopPropagation()}
                        >
                          <Avatar
                            alt={toClubShortName}
                            src={toClubPhoto && images[toClubPhoto] && images[toClubPhoto].downloadURL}
                          />
                          <Typography variant='body2' component='div'>
                            {toClubShortName}
                          </Typography>
                        </StyledAvatarLink>
                      </TableCell>
                        <TableCell>{endDate && t('Transfers.tablecell.toDate', { date: format(endDate, dateFormate) })}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
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