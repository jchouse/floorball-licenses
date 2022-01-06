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
  onChange: (value: string) => void;
}

export default function CountrySelect(props: ICountrySelectProps) {
  const { label, onChange } = props;
  const { i18n } = useTranslation();

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

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: 200 }}
      onChange={onChangeHandler}
      renderInput={(params) => <TextField {...params} label={label}/>}
    />
  );
}
