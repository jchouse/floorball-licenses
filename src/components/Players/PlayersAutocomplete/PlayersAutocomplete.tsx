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
  id: string;
}

export default function PlayersAutocomplete(props: PlayersAutocompleteProps) {
  const { players, player, onChange } = props;
  const { t } = useTranslation();

  const options = React.useMemo(() => (
    Object.keys(players).map((key) => ({
        id: key,
        label: `${players[key].firstName} ${players[key].lastName} (${players[key].license})`,
      }
    )
  )), [players]);

  let playerObj = options[0];

  if (player) {
    playerObj = options.find((option) => option.id === player) || options[0];
  }

  const [value, setValue] = React.useState<IOption | null>(null);
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (playerObj) {
      setValue(playerObj);
      setInputValue(playerObj.label);
    }
  }, [playerObj]);

  return (
    <Autocomplete
      value={value}
      onChange={(event: any, newValue: IOption | null) => {
        onChange(newValue?.id || '');
        setValue(newValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
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
