import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import { Grid, Cell } from 'react-md';
import BEM from '../../../../components/BEM/BEM';
import Form from '../../../../components/Form/Form.jsx';
import PhotoControl from '../../../../components/Photo/Control/Control.jsx';
import './Edit.css';

/**
 * Edit Player
 */
class EditPlayer extends React.Component {
    static defaultProps = {
        bem: new BEM('edit-player')
    };

    constructor() {
        super();

        // eslint-disable-next-line
        this.state.playersData = this.playersData;
        // eslint-disable-next-line
        this.state.playerEditSchema = this.playerEditSchema;
    }

    state = {};

    get playersData() {
        return {
            firstNameUA: '',
            secondNameUA: '',
            lastNameUA: '',
            born: new Date().valueOf(),
            citizenship: '',
            firstNameEN: '',
            lastNameEN: '',
            photo: '',
            weight: '',
            height: '',
            position: '',
            side: '',
            license: '',
            licenseType: '',
            gender: '',
            club: '',
            endActivationDate: new Date(1567209600000).valueOf(),
            registrDate: new Date().valueOf()
        };
    }

    get playerEditSchema() {
        return [
            {
                id: 'endActivationDate',
                label: 'License exp. date',
                type: 'date',
                required: true
            },
            {
                id: 'registrDate',
                label: 'Start licence date SYSTEM',
                type: 'date',
                required: true
            },
            {
                id: 'club',
                type: 'select',
                label: 'Club',
                menuItems: []
            },
            {
                id: 'lastNameUA',
                label: 'Last Name',
                placeholder: 'Last Name',
                required: true
            },
            {
                id: 'firstNameUA',
                label: 'First Name',
                placeholder: 'First Name',
                required: true
            },
            {
                id: 'secondNameUA',
                label: 'Second Name',
                placeholder: 'Second Name',
                required: true
            },
            {
                id: 'citizenship',
                label: 'Citizenship',
                placeholder: 'ISO ALPHA-2 Code',
                required: true
            },
            {
                id: 'born',
                label: 'Born',
                type: 'date',
                required: true
            },
            {
                id: 'firstNameEN',
                label: 'First name english',
                placeholder: 'First name english'
            },
            {
                id: 'lastNameEN',
                label: 'Second name english',
                placeholder: 'Second name english'
            },
            {
                id: 'height',
                label: 'Height',
                placeholder: 'Height'
            },
            {
                id: 'weight',
                label: 'Weight',
                placeholder: 'Weight'
            },
            {
                type: 'select',
                id: 'position',
                label: 'Position',
                menuItems: [
                    {
                        label: 'Defender',
                        value: 'DEFENDER'
                    },
                    {
                        label: 'Forward',
                        value: 'FORWARD'
                    },
                    {
                        label: 'Goalie',
                        value: 'GOALIE'
                    }
                ]
            },
            {
                type: 'select',
                id: 'side',
                label: 'Stick side',
                menuItems: [
                    {
                        label: 'L',
                        value: 'L'
                    },
                    {
                        label: 'R',
                        value: 'R'
                    }
                ]
            },
            {
                type: 'select',
                id: 'licenseType',
                label: 'License Type',
                menuItems: [
                    {
                        label: 'Senior',
                        value: 'SENIOR'
                    },
                    {
                        label: 'Junior',
                        value: 'JUNIOR'
                    }
                ]
            },
            {
                type: 'select',
                id: 'gender',
                label: 'Gender',
                menuItems: [
                    {
                        label: 'Male',
                        value: 'MALE'
                    },
                    {
                        label: 'Female',
                        value: 'FEMALE'
                    }
                ]
            }
        ];
    }

    updateClubsList() {
        const { clubsList } = this.props;

        return Object.keys(clubsList).map(club => {
            const _c = clubsList[club];

            return {
                value: club,
                'data-icon': _c.logoUrl,
                label: _c.shortNameUA
            };
        });
    }

    render() {
        const { bem, imagesList, playersData = this.playersData, clubsList } = this.props,
            { playerEditSchema, logoUrl } = this.state;
        let content = <Cell offset={5} size={1}>
            Loading...
        </Cell>;

        if (isLoaded(playersData)) {
            const { photo } = playersData,
                photoUrl = photo && imagesList && imagesList[photo] && imagesList[photo].downloadURL;

            if (isLoaded(clubsList)) {
                playerEditSchema[2].menuItems = this.updateClubsList();
            }

            content = <Grid className={bem.elem('main').cls('row')}>
                <Cell offset={2} size={3}>
                    <img className={bem.elem('main-logo').cls()} src={logoUrl || photoUrl} alt={photo}/>
                    <PhotoControl
                        alt={playersData.lastNameEN}
                        uploadPhotoHandler={this.uploadPhotoHandler}/>
                </Cell>
                <Cell offset={1} size={4} className={bem.elem('main-info').cls()}>
                    <Form
                        data={playersData}
                        schema={playerEditSchema}
                        submit={this.submit}/>
                </Cell>
            </Grid>;
        }

        return content;
    }

    uploadPhotoHandler = (photo, url) => {
        this.setState({
            logoUrl: url,
            photo
        });
    };

    submit = async data => {
        const { firebase: { push, update }, playersData, params: { id }, playersID } = this.props,
            { photo } = this.state,
            savedData = { ...playersData, ...data };

        if (photo) {
            savedData.photo = photo;
        }

        if (id === 'new') {
            const licenseNumber = playersID + 1;

            savedData.license = licenseNumber.toString().padStart(8, '0');

            await update('counters', { playerID: licenseNumber });
            push('players', savedData).then(this.goToSavedData);
        } else {
            update(`players/${id}`, savedData).then(this.goToSavedData);
        }
    };

    goToSavedData = data => {
        const { router, params: { id } } = this.props;

        router.push(`/players/${data ? data.key : id}`);
    }
}

function mapStateToProps(state, props) {
    const { firebase: { data: { images, clubs, players, counters } } } = state;

    return {
        clubsList: clubs,
        imagesList: images,
        playersData: players && players[props.params.id],
        playersID: counters && counters.playerID
    };
}

export default compose (
    firebaseConnect(['images', 'clubs', 'players', 'counters/playerID']),
    connect(mapStateToProps),
    withRouter
)(EditPlayer);
