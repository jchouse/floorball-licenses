import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, generatePath, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';
import cn from 'classnames';
import Helmet from 'react-helmet';

import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { clubsListDropdown } from '../../Clubs/ClubsListDropdown/ClubsListDropdown';

import { pages } from '../../../constans/location';
import {
  dateFormate,
  activeSeason,
} from '../../../constans/settings';
import { useStyles } from '../Players.styles';

import { IClub } from '../../Clubs/Clubs';
import { IImage } from '../../FileUploader/FileUploader';
import { IPlayer } from '../../Players/Players';

const NOW = new Date();

const headCell = [
  { id: 'license', labelI18nKey: 'Players.table.license', showMatchesMD: true },
  { id: 'photo', labelI18nKey: 'Players.table.photo', showMatchesMD: true },
  { id: 'firstName', labelI18nKey: 'Players.table.firstName', showMatchesMD: true },
  { id: 'lastName', labelI18nKey: 'Players.table.lastName', showMatchesMD: true },
  { id: 'gender', labelI18nKey: 'Players.gender.header', showMatchesMD: false },
  { id: 'age', labelI18nKey: 'Players.table.age', showMatchesMD: false },
  { id: 'club', labelI18nKey: 'Players.table.club', showMatchesMD: false },
];

export const gendersMap = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
};

interface IPlayerTableRowProps {
  players: [string, IPlayer][];
  clubs: Record<string, IClub>;
  images: Record<string, IImage>;
  handleClick: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, key: string) => void;
  handleClubClick: (event: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement, MouseEvent>, key: string) => void;
  translator: (key: string) => string;
  classes: any,
  matchesMD: boolean,
};

function PlayersTableRows(props: IPlayerTableRowProps) {
  const {
    players,
    clubs,
    images,
    classes,
    handleClick,
    handleClubClick,
    translator,
    matchesMD,
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
        const isExpired = endActivationDate < NOW.valueOf();

        return (
          <TableRow
            hover
            classes={{ root: cn({ [classes.disabledRow]: isExpired }) }}
            onClick={event => handleClick(event, key)}
            key={key}
          >
            <TableCell>{license}</TableCell>
            <TableCell>
              <Avatar
                alt={`${firstName} ${lastName}`}
                src={playerPhoto && images[playerPhoto] && images[playerPhoto].downloadURL}
              />
            </TableCell>
            <TableCell>{firstName}</TableCell>
            <TableCell>{lastName}</TableCell>
            {matchesMD && <TableCell>{genderMap[gender]}</TableCell>}
            {matchesMD && <TableCell>
              {`${differenceInYears(NOW, born)} (${format(born, dateFormate)})`}
            </TableCell>}
            {matchesMD && <TableCell>
              <div
                className={classes.clubLogoCell}
              >
                <img
                  className={classes.clubLogo}
                  alt={shortName}
                  src={clubsLogo && images[clubsLogo] && images[clubsLogo].downloadURL}
                />
                <Link
                  onClick={event => handleClubClick(event, club)}
                >{shortName}</Link>
              </div>
            </TableCell>}
          </TableRow>
        );
      })}
    </TableBody>
  );
}

const enum filterMap {
  license = 'license',
  licenseType = 'licenseType',
  name = 'name',
  club = 'club',
  gender = 'gender',
  age = 'age',
  expired = 'expired',
};

interface IPlayersFilterProps {
  clubs: Record<string, IClub>;
  searchParams: queryString.ParsedQuery<string>;
  changeFilterHandler: (name: string, value: string) => void;
  handleChangePage: (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, page: number) => void;
  translator: (key: string) => string;
}

function PlayersFilter(props: IPlayersFilterProps) {
  const {
    translator,
    changeFilterHandler,
    searchParams,
    handleChangePage,
    clubs,
  } = props;
  const changeInputHandler = (name: string) => (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    changeFilterHandler(name, event.target.value);
    handleChangePage(event, 0);
  };
  const changeSwitchHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    changeFilterHandler(name, event.target.checked.toString());
    handleChangePage(event, 0);
  };
  const clubsItems = React.useMemo(() => clubsListDropdown(clubs), [clubs]);

  return (
    <Grid
      container
      alignItems='flex-end'
      spacing={{xs: 1, md: 2}}
    >
      <Grid
        xs={12}
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
        xs={12}
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
            value={searchParams[filterMap.licenseType] as string || ''}
            onChange={changeInputHandler(filterMap.licenseType)}
          >
            <MenuItem value=''>{translator('Players.filter.all')}</MenuItem>,
            {activeSeason.possibleLiciensies.map(license => (
              <MenuItem key={license.value} value={license.value}>{license.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        xs={12}
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
        xs={12}
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
            value={searchParams[filterMap.club] as string || ''}
            onChange={changeInputHandler(filterMap.club)}
          >
            <MenuItem value=''>{translator('Players.filter.all')}</MenuItem>
            {clubsItems.map(club => (
              <MenuItem key={club.value} value={club.value}>{club.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        xs={12}
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
            value={searchParams[filterMap.gender] as string || ''}
            onChange={changeInputHandler(filterMap.gender)}
          >
            <MenuItem value=''>{translator('Players.filter.all')}</MenuItem>
            {Object.entries(gendersMap).map(([key]) => (
              <MenuItem key={key} value={key}>{translator(`Players.gender.${key}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        xs={12}
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
        xs={12}
        md={2}
        item
      >
        <FormControlLabel
          control={
            <Switch
              name={filterMap.expired}
              color='primary'
              checked={searchParams[filterMap.expired] === 'true'}
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

function stableSort(players: Record<string, IPlayer>, comparator: queryString.ParsedQuery<string>) {
  let result = Object.entries(players);

  if (comparator[filterMap.license]) {
    const license = comparator[filterMap.license] || '';

    result = result
      .filter(([, player]) => player.license.toString().includes(license.toString()));
  }

  if (comparator[filterMap.licenseType]) {
    result = result
      .filter(([, player]) => player.licenseType === comparator[filterMap.licenseType]);
  }

  if (comparator[filterMap.name]) {
    result = result
      .filter(([, player]) => {
        const searchString = `${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`;
        const reqString = (comparator[filterMap.name] as string).toLowerCase();

        return searchString.includes(reqString);
      });
  }

  if (comparator[filterMap.club]) {
    result = result
      .filter(([, player]) => player.currentClub ? player.currentClub === comparator[filterMap.club] : player.firstClub === comparator[filterMap.club]);
  }

  if (comparator[filterMap.gender]) {
    result = result
      .filter(([, player]) => player.gender === comparator[filterMap.gender]);
  }

  if (comparator[filterMap.age]) {
    result = result
      .filter(([, player]) => differenceInYears(NOW, player.born) <= parseInt(comparator[filterMap.age] as string));
  }

  if (comparator[filterMap.expired] !== 'true') {
    result = result
      .filter(([, player]) => player.endActivationDate >= NOW.valueOf());
  }

  return result;
}

const ROWS_PER_PAGE = [10, 25, 50];

interface IPlayerListProps {
  clubs: Record<string, IClub>;
  images: Record<string, IImage>;
  players: Record<string, IPlayer>;
}

export default function PlayersList({ clubs, players, images }: IPlayerListProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWS_PER_PAGE[0]);

  let searchParams = queryString.parse(location.search);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClubClick = (event: React.MouseEvent<HTMLTableRowElement | HTMLAnchorElement | HTMLSpanElement, MouseEvent> , key: string) => {
    event.stopPropagation();

    navigate(generatePath(`${pages.CLUBS}/${pages.CLUB_INFO}`, { id: key }));
  };

  const handlePlayerRowClick = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, key: string) => {
    event.stopPropagation();

    navigate(generatePath(`${pages.PLAYERS}/${pages.PLAYER_INFO}`, { id: key }));
  };

  const setFilterLocation = (name: string, value: string) => {
    if (value) {
      searchParams = {
        ...searchParams,
        [`${name}`]: value,
      };
    } else if (searchParams[name]) {
      delete searchParams[name];
    }

    const stringified = queryString.stringify(searchParams);

    navigate(`${location.pathname}?${stringified}`, { replace: true });
  };

  const playersRows = stableSort(players, searchParams);

  const matchesMD = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

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
        />
        <Paper>
          <TableContainer>
            <Table
              aria-labelledby='tableTitle'
              aria-label='players table'
            >
              <TableHead>
                <TableRow>
                  {headCell.map(headCell => {
                    if (!matchesMD && !headCell.showMatchesMD) {
                      return null;
                    }

                    return (
                      <TableCell
                        key={headCell.id}
                      >
                        {t(headCell.labelI18nKey)}
                      </TableCell>
                    );
                  })}
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
                matchesMD={matchesMD}
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
