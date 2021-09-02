import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { AutoComplete } from 'react-md';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';

class PlayersSearch extends React.PureComponent {
  render() {
    const { id, label, placeholder, players } = this.props;

    return isLoaded(players) && <AutoComplete
      id={id}
      label={label}
      placeholder={placeholder}
      data={this.getPlayersList(players)}
      filter={AutoComplete.caseInsensitiveFilter}
      onAutoComplete={this.handleAutoComplete}/>;
  }

  handleAutoComplete = (suggestion, suggestionIndex, matches) => {
    const { linkedFields, players } = this.props;
    const { data } = matches[suggestionIndex];

    let dataObject = {};

    if (linkedFields) {
      Object.entries(linkedFields).forEach(([key, value]) => {
        dataObject = {
          [key]: players[data][value],
        };
      });
    }

    this.props.onChange(data, dataObject);
  }

  getPlayersList(players) {
    return Object.entries(players).map(([key, { firstNameEN, firstNameUA, lastNameEN, lastNameUA, license }]) => ({
      data: key,
      primaryText: `${firstNameUA} ${lastNameUA} (${license}) ${firstNameEN} ${lastNameEN}`,
    }));
  }
}

function mapStateToProps(state) {
  const { firebase: { data: { players } } } = state;

  return { players };
}

export default compose(
  firebaseConnect(['players']),
  connect(mapStateToProps)
)(PlayersSearch);