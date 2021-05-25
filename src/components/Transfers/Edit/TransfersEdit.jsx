import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Grid, Cell } from 'react-md';
import BEM from '../../BEM/BEM';
import Form from '../../Form/Form.jsx';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';

/**
 * Transfers Edit
 */
class TransfersEdit extends React.Component {
  static defaultProps = {
    bem: new BEM('transfers-new'),
  };

  state = {
    transferData: this.transferData,
  };

  get transferData() {
    return {
      player: '',
      fromClub: '',
      toClub: '',
      date: new Date().getTime(),
      endDate: '',
    };
  }

  get transfersEditSchema() {
    return [
      {
        type: 'playerSearch',
        id: 'player',
        label: 'Player ID',
        placeholder: 'Player ID',
        required: true,
        linkedFields: {
          fromClub: 'club',
        },
        players: [],
      },
      {
        type: 'select',
        id: 'fromClub',
        label: 'From Club',
        required: true,
        disabled: true,
        menuItems: [],
      },
      {
        type: 'select',
        id: 'toClub',
        label: 'To Club',
        required: true,
        menuItems: [],
      },
      {
        id: 'date',
        label: 'Transfer Date',
        type: 'date',
        required: true,
      },
      {
        id: 'endDate',
        label: 'Loan end Date',
        type: 'date',
      },
    ];
  }

  render() {
    const { bem, clubsList } = this.props,
      { transferData } = this.state;

    let { transfersEditSchema } = this;

    if (isLoaded(clubsList)) {
      transfersEditSchema = this.updateClubsList(clubsList, transfersEditSchema);
    }

    return (
      <Grid className={bem.cls()}>
        <Cell size={8} offset={2} className={bem.elem('main').cls()}>
          <Form
            data={transferData}
            schema={transfersEditSchema}
            submit={this.submit}/>
        </Cell>
      </Grid>
    );
  }

  updateClubsList(clubsList, transfersEditSchema) {
    const options = Object.entries(clubsList).map(([clubId, clubData]) => ({
      value: clubId,
      label: clubData.shortNameUA,
    }));

    transfersEditSchema[1].menuItems = options;
    transfersEditSchema[2].menuItems = options;

    return transfersEditSchema;
  }

  submit = async data => {
    const {
      router,
      firebase: { push, update },
      players,
      transfersData, params: { id },
    } = this.props,
      savedData = { ...transfersData, ...data },
      playerId = savedData.player,
      player = { ...players[playerId] };

    if (id === 'new') {
      const data = await push('transfers', savedData);

      player.transfers = player.transfers || [];
      player.transfers.push(data.key);
    } else {
      await update(`transfers/${id}`, savedData);
    }

    if (!savedData.endDate) {
      player.club = savedData.toClub;
    }

    await update(`players/${playerId}`, player);

    router.push('/transfers');
  }
}

function mapStateToProps(state, props) {
  const { firebase: { data: { clubs, transfers, players } } } = state;

  return {
    clubsList: clubs,
    transferData: transfers && transfers[props.params.id],
    players,
  };
}

export default compose(
  firebaseConnect(['clubs', 'transfers', 'players']),
  connect(mapStateToProps),
  withRouter
)(TransfersEdit);
