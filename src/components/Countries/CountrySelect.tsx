import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import ukCountries from 'i18n-iso-countries/langs/uk.json';

countries.registerLocale(enCountries);
countries.registerLocale(ukCountries);

interface ICountrySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CountrySelect(props: ICountrySelectProps) {
  const { label, value, onChange } = props;
  const { i18n } = useTranslation();

  let lang = i18n.language;

  if (lang.includes('-')) {
    lang = lang.split('-')[0];
  }

  const options = useMemo(() => {
    const names = countries.getNames(lang);
    
    return [
      { id: '', label: ''},
      ...Object.entries(names).map(([key, value]) => ({
        id: key,
        label: value,
      }))
    ];
  }, [lang]);

  const onChangeHandler = useCallback(( event: React.SyntheticEvent<Element, Event>, data: { id: string, label: string } | null ) => {
    const { id = '' } = data || {};

    onChange(id);
  } , [onChange]);

  let _value = useMemo(() => {
    return options.find(({ id: country }) => country === value);
  }, [value, options]);

  if (!_value) {
    _value = options[0];
  }

  return (
    <Autocomplete
      disablePortal
      value={_value}
      id='country-select'
      options={options}
      onChange={onChangeHandler}
      renderInput={(params) => <TextField {...params} label={label}/>}
    />
  );
}
