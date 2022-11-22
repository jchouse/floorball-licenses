import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, generatePath, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { getDatabase, ref, set, push, child } from 'firebase/database';

import Grid from '@mui/material/Grid';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import PlayersAutocomplete from '../../Players/PlayersAutocomplete/PlayersAutocomplete';
import { firebaseApp } from '../../../firebaseInit';
import { db_paths } from '../../../db/db_constans';
import { NEW_ENTITY, pages } from '../../../constans/location';
import TextField from '@mui/material/TextField';
import { ITransfer } from '../Transfers';
import { IPlayer } from '../../Players/Players';
import { IClub } from '../../Clubs/Clubs';
import { clubsListDropdown } from '../../Clubs/ClubsListDropdown/ClubsListDropdown';

const database = getDatabase(firebaseApp);

const initialValues: ITransfer = {
  date: new Date().valueOf(),
  fromClub: '',
  player: '',
  toClub: '',
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

interface ITransfersEditProps {
  transfers: Record<string, ITransfer>;
  players: Record<string, IPlayer>;
  clubs: Record<string, IClub>;
}

export default function TransfersEdit(props: ITransfersEditProps) {
  const { transfers, players, clubs } = props;
  const [message, setMessage] = useState<AlertColor | null>(null);
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isNew = id === NEW_ENTITY;
  const history = useHistory();
  const [isLoan, setIsLoan] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues: initialValues });

  useEffect(() => {
    const transfer = transfers[id];

    if (transfer) {
      setValue('date', transfer.date);
      setValue('fromClub', transfer.fromClub);
      setValue('player', transfer.player);
      setValue('toClub', transfer.toClub);

      if (transfer.endDate) {
        setIsLoan(true);
        setValue('endDate', transfer.endDate);
      }
    }
  }, [setValue, id, transfers]);

  const handleClose = useCallback(() => {
    setMessage(null);
  }, []);

  const handleChangeIsLoan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoan(event.target.checked);
  };

  const clubsItems = React.useMemo(() => clubsListDropdown(clubs), [clubs]);

  const onSubmit: SubmitHandler<ITransfer> = async (data) => {
    let transferId = id;
    const updates: Partial<Record<string, ITransfer | number>> = {};

    if (isNew) {
      transferId = push(child(ref(database), db_paths.Transfers)).key || '';
    }

    if (data.date) {
      data.date = new Date(data.date).valueOf();
    }

    if (isLoan && data.endDate) {
      data.endDate = new Date(data.endDate).valueOf();
    } else {
      delete data.endDate;
    }

    updates[`/${db_paths.Transfers}/` + transferId] = {
      ...data,
    };

    set(ref(database, `/${db_paths.Transfers}/` + transferId), data)
      .then(() => {
        setMessage('success');
        history.push(generatePath(pages.TRANSFER_EDIT, { id: transferId }));
      })
      .catch(() => {
        setMessage('error');
      });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} key={id}>
      <Grid
        container
        justifyContent='center'
        spacing={4}
      >
        <Grid
          item
          xs={10}
          container
          spacing={2}
          flexDirection='column'
        >
          <Grid item>
            <Controller
              name='date'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <DesktopDatePicker
                  inputFormat='dd/MM/yyyy'
                  label={t('Transfers.tablecell.fromDate')}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={Boolean(errors.date)}
                      helperText={errors.date && t('Transfers.form.dateRequired')}
                    />
                  )}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              name='player'
              control={control}
              render={({ field }) => (
                <PlayersAutocomplete
                  players={players}
                  player={field.value}
                  onChange={(player: string) => {
                    setValue('player', player);
                    setValue('fromClub', players[player]?.currentClub || '');
                  }}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              name='fromClub'
              control={control}
              render={({ field }) => 
                <FormControl
                  fullWidth
                  variant='outlined'
                  disabled
                >
                  <InputLabel id='givingClub'>{t('Transfers.tablehead.givingClub')}</InputLabel>
                  <Select
                    {...field}
                    label={t('Transfers.tablehead.givingClub')}
                    labelId='givingClub'
                    disabled
                  >
                    <MenuItem value={''}>{' '}</MenuItem>
                    {clubsItems.map(club => (
                      <MenuItem key={club.value} value={club.value}>{club.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='toClub'
              control={control}
              render={({ field }) => 
                <FormControl
                  fullWidth
                  variant='outlined'
                >
                  <InputLabel id='recivingClub'>{t('Transfers.tablehead.recivingClub')}</InputLabel>
                  <Select
                    {...field}
                    label={t('Transfers.tablehead.recivingClub')}
                    labelId='recivingClub'
                  >
                    <MenuItem value={''}>{' '}</MenuItem>
                    {clubsItems.map(club => (
                      <MenuItem key={club.value} value={club.value}>{club.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              value="start"
              control={
                <Switch
                  checked={isLoan}
                  onChange={handleChangeIsLoan}
                />
              }
              label={t('Transfers.isLoan') as string}
            />
          </Grid>
          {isLoan && <Grid item>
            <Controller
              name='endDate'
              control={control}
              rules={{
                required: isLoan,
              }}
              render={({ field }) =>
                <DesktopDatePicker
                  inputFormat='dd/MM/yyyy'
                  label={t('Transfers.tablecell.toDate')}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={Boolean(errors.endDate)}
                      helperText={errors.endDate && t('Transfers.form.dateRequired')}
                    />
                  )}
                  {...field}
                />
              }
            />
          </Grid>}
          <Grid item>
            <Button type='submit' variant='contained' color='primary'>
              {t('Floorball.form.save')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar open={!!message} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message || 'success'} sx={{ width: '100%' }}>
          {t(`Floorball.form.${message}`)}
        </Alert>
      </Snackbar>
    </form>
  );
}
