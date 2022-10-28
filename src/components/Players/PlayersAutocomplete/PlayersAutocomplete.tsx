import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';

import { IPlayer } from '../../Players/Players';

interface PlayersAutocompleteProps {
  players: Record<string, IPlayer>;
  player: string;
  onChange: (player: string) => void;
}

interface IOption {
  label: string;
  value: string;
}

export default function PlayersAutocomplete(props: PlayersAutocompleteProps) {
  const { players, player, onChange } = props;
  let predifinedPlayer: IOption | null = null;
  const { t } = useTranslation();

  const options = React.useMemo(() => (
    Object.keys(players).map((key) => ({
        value: key,
        label: `${players[key].firstName} ${players[key].lastName} (${players[key].license})`,
      }
    )
  )), [players]);

  if (player) {
    predifinedPlayer = {
      value: player,
      label: `${players[player].firstName} ${players[player].lastName} (${players[player].license})`,
    };
  }

  const [value, setValue] = React.useState<IOption | null>(predifinedPlayer);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Autocomplete
      value={value}
      onChange={(event: any, newValue: IOption | null) => {
        onChange(newValue?.value || '');
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      id='palyers-autocomplete'
      options={options}
      renderInput={(params) => <TextField {...params} label={t('Players.autocomplite')}/>}
    />
  );
}