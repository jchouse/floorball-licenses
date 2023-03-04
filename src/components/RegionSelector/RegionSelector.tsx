import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { regions } from './Regions';

interface IRegionSelectorProps {
  label: string;
  error: boolean;
  helperText: string | undefined;
  value: string;
  onChange: (value: string) => void;
}

export default function RegionSelector(props: IRegionSelectorProps) {
  const { i18n } = useTranslation();
  const {
    label,
    error,
    helperText,
    onChange,
    value = {
      id: '',
      label: '',
    },
  } = props;

  const lang = i18n.languages[1] === 'uk' ? 'uk' : 'en';

  const options = useMemo(() => {
    return [
      { id: '', label: ''},
      ...regions.map(region => ({
        id: region.id,
        label: region[lang],
      }))
    ];
  }, [lang]);

  const onChangeHandler = useCallback(( event: React.SyntheticEvent<Element, Event>, data: { id: string, label: string } | null ) => {
    const { id = '' } = data || {};

    onChange(id);
  } , [onChange]);

  let _value = useMemo(() => {
    return options.find(({ id: region }) => region === value);
  }, [value, options]);

  if (!_value) {
    _value = options[0];
  }

  return (
    <Autocomplete
      value={_value}
      id='region-select'
      options={options}
      onChange={onChangeHandler}
      renderInput={(params) => (
        <TextField
          {...params}
          value={_value}
          label={label}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}