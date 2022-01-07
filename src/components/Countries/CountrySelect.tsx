import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';
import Autocomplete, {  } from '@mui/material/Autocomplete';

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
    const names = countries.getNames(i18n.language);
    
    return Object.entries(names).map(([key, value]) => ({
      value: key,
      label: value,
    }));
  }, [i18n.language]);

  const onChangeHandler = useCallback(( event: React.SyntheticEvent<Element, Event>, data: { value: string, label: string } | null ) => {
    const { value = '' } = data || {};

    onChange(value);
  } , [onChange]);

  const _value = useMemo(() => {
    return options.find(({ value: country }) => country === value);
  }, [value, options]);

  return (
    <Autocomplete
      disablePortal
      value={_value}
      id="combo-box-demo"
      options={options}
      sx={{ width: 200 }}
      onChange={onChangeHandler}
      renderInput={(params) => <TextField {...params} label={label}/>}
    />
  );
}
