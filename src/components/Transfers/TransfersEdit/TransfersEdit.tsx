import React, { useCallback, useState } from 'react';
import { useParams, useHistory, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { getDatabase, ref, update, push, child } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';

import Grid from '@mui/material/Grid';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import PlayersAutocomplete from '../../Players/PlayersAutocomplete/PlayersAutocomplete';
import { firebaseApp } from '../../../firebaseInit';
import { db_paths } from '../../../db/db_constans';
import { NEW_ENTITY, pages } from '../../../constans/location';
import TextField from '@mui/material/TextField';
import { ITransfer } from '../Transfers';
import { IPlayer } from '../../Players/Players';
import { IClub } from '../../Clubs/Clubs';

const database = getDatabase(firebaseApp);

const initialValues: ITransfer = {
  date: 0,
  fromClub: '',
  player: '',
  toClub: '',
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ITransfersEditProps {
  transfers: Record<string, ITransfer>;
  players: Record<string, IPlayer>;
  clubs: Record<string, IClub>;
}

export default function TransfersEdit(props: ITransfersEditProps) {
  const [message, setMessage] = useState<AlertColor | null>(null);
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isNew = id === NEW_ENTITY;

  const { transfers, players, clubs } = props;

  let defaultValues = initialValues;

  if (!isNew) {
    defaultValues = transfers[id];
  }

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues });

  const handleClose = useCallback(() => {
    setMessage(null);
  }, []);

  const onSubmit: SubmitHandler<ITransfer> = async (data) => {
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              render={({ field }) =>
                <DesktopDatePicker
                  label={t('Transfers.tablecell.date')}
                  renderInput={params => <TextField {...params}/>}
                  {...field}
                />
              }
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
                  }}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              name='endDate'
              control={control}
              render={({ field }) =>
                <DesktopDatePicker
                  label={t('Transfers.tablecell.date')}
                  renderInput={params => <TextField {...params}/>}
                  {...field}
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
