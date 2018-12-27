import React, { Component } from 'react';
import { compose } from 'redux';
import { firebaseConnect, populate } from 'react-redux-firebase';
import connect from 'react-redux/es/connect/connect';
import { Autocomplete, Grid, Cell, Button } from 'react-md';
import BEM from '../../../components/BEM/BEM';
import { licenseRequest, addPlayerToRequest } from '../ActionsRequests';

class NewRequest extends Component {
    static defaultProps = {
        bem: new BEM('requests-new')
    };

    constructor(props) {
        super(props);
        const { dispatch } = this.props;

        dispatch(licenseRequest('new'));
    }

    render() {
        return [
            <Grid key='header'>
                {'Here is new request for license {number} from {date}'}
            </Grid>,
            <Grid key='controls'>
                {this.renderSelectPlayers()}
            </Grid>,
            <Grid key='users-table'>
                {this.renderList()}
            </Grid>,
            <Grid key='send-form'>
                {'Confirm request button'}
            </Grid>
        ];
    }

    addPlayer = e => {
        e.preventDefault();
        const { addingProcess } = this.state;

        if (!addingProcess) {
            this.setState({
                addingProcess: true
            });
        }

    };

    renderList() {
        const { bem, licenseRequest: { playersList = {} } } = this.props;

        return <Cell size={12} className={bem.elem('list').cls()}>
            {Object.entries(playersList).map((elem, i) => (<div key={i}>{elem.toString()}</div>))}
        </Cell>;
    }

    renderSelectPlayers() {
        const { clubsPlayers } = this.props;

        return [
            <Cell
                key='select-player'
                size={2}>
                <Autocomplete
                    id='clubs-players'
                    label='Players'
                    placeholder='Марко Вовчок'
                    data={clubsPlayers}
                    clearOnAutocomplete={true}
                    filter={Autocomplete.caseInsensitiveFilter}
                    onAutocomplete={this.autocompleteHandler}/>
            </Cell>,
            <Cell
                size={2}
                key={'text'}
                align='bottom'>
                {'or '}
                <Button
                    raised
                    secondary>
                    add new player
                </Button>
            </Cell>
        ];
    }

    autocompleteHandler = (suggestion, suggestionIndex, matches) => {
        const { dispatch, players, user: { clubId }, licenseRequest: { playersList } } = this.props,
            { data } = matches[suggestionIndex],
            newPlayerInRequest = players[data];

        if (newPlayerInRequest && !playersList[data]) {
            dispatch(addPlayerToRequest({ [data]: newPlayerInRequest }, clubId));
        }
    };
}

function mapStateToProps(state) {
    const {
            user,
            locale,
            licenseRequest,
            firebase,
            firebase: {
                data: {
                    players,
                    requests
                }
            }
        } = state,
        clubsPlayers = [];

    if (players && user && user.clubId) {
        Object.entries(players).forEach(([playerId, plVal]) => {
            if (plVal.club === user.clubId) {
                clubsPlayers.push({
                    data: playerId,
                    primaryText: locale === 'en'
                        ? `${plVal.firstNameEN} ${plVal.lastNameEN}`
                        : `${plVal.firstNameUA} ${plVal.lastNameUA}`
                });
            }
        });
    }

    return {
        players: populate(firebase, 'players', {}),
        locale,
        user,
        requests,
        clubsPlayers,
        licenseRequest
    };
}

export default compose(
    firebaseConnect(['players', 'requests']),
    connect(mapStateToProps)
)(NewRequest);