import React, { Component } from 'react';
import { Autocomplete } from 'react-md';
import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import ukCountries from 'i18n-iso-countries/langs/uk.json';

countries.registerLocale(enCountries);
countries.registerLocale(ukCountries);

class Countries extends Component {
  static defaultProps = {
    locale: 'uk',
  }

  static getCountry(code, locale) {
    return countries.getName(code, locale);
  }

  state = {
    value: this.props.defaultValue,
    data: this.getCountriesList(countries.getNames(this.props.locale)),
    locale: this.props.locale,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.state.value) {
      this.setState({
        value: Countries.getCountry(nextProps.defaultValue, nextProps.locale),
      });
    }

    if (nextProps.locale !== this.props.locale) {
      this.setState({
        data: this.getCountriesList(countries.getNames(nextProps.locale)),
      });
    }
  }

  render() {
    const { id, label, placeholder, required } = this.props;
    const { value, data } = this.state;

    return <Autocomplete
      id={id}
      label={label}
      placeholder={placeholder}
      value={value}
      data={data}
      required={required}
      filter={Autocomplete.caseInsensitiveFilter}
      onChange={this.changeHandler}
      onAutocomplete={this.autocompleteHandler}/>;
  }

  getCountriesList(names) {
    return Object.entries(names).map(([key, value]) => ({
      data: key,
      primaryText: value,
    }));
  }

  changeHandler = value => {
    this.setState({ value: Countries.getCountry(value, this.props.locale) });
  };

  autocompleteHandler = (suggestion, suggestionIndex, matches) => {
    const { data } = matches[suggestionIndex];

    if (this.props.onSelect) {
      this.props.onSelect(data);
    }
  }
}

export default Countries;
