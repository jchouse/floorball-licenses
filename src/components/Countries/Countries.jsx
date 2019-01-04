import React, { Component } from 'react';
import { Autocomplete } from 'react-md';
import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import ukCountries from 'i18n-iso-countries/langs/uk.json';

countries.registerLocale(enCountries);
countries.registerLocale(ukCountries);

class Countries extends Component {
    constructor(props) {
        super(props);

        this.names = countries.getNames(props.locale);
    }

    static getCountry(code, locale) {
        return countries.getName(code, locale);
    }

    state = {
        value: this.props.defaultValue
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue !== this.state.value) {
            this.setState({
                value: Countries.getCountry(nextProps.defaultValue, nextProps.locale)
            });
        }
    }

    render() {
        const { id, label, placeholder } = this.props,
            { value } = this.state;

        return <Autocomplete
            id={id}
            label={label}
            placeholder={placeholder}
            value={value}
            data={this.getCountriesList()}
            filter={Autocomplete.caseInsensitiveFilter}
            onChange={this.changeHandler}
            onAutocomplete={this.autocompleteHandler}/>;
    }

    getCountriesList() {
        const { names } = this;

        return Object.entries(names).map(([key, value]) => {
            return {
                data: key,
                primaryText: value
            };
        });
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