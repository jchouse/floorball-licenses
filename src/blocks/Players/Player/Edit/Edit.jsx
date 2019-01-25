import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Grid, Cell, Button } from 'react-md';
import BEM from '../../../../components/BEM/BEM';
import Form from '../../../../components/Form/Form.jsx';
import PhotoControl from '../../../../components/Photo/Control/Control.jsx';
import './Edit.css';

/**
 * Edit Player
 */
class EditPlayer extends React.Component {
    static defaultProps = {
        bem: new BEM('edit-player'),
        playersData: {
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
        }
    };

    state = {};

    get playerEditSchema() {
        const { intl } = this.props;

        return [
            {
                id: 'registrDate',
                label: intl.formatMessage({ id: 'Players.registrDate' }),
                type: 'date',
                required: true
            },
            {
                id: 'license',
                label: intl.formatMessage({ id: 'Players.license.header' }),
                type: 'number',
                required: true
            },
            {
                id: 'endActivationDate',
                label: intl.formatMessage({ id: 'Players.endActivationDate.label' }),
                type: 'date',
                required: true
            },
            {
                id: 'club',
                type: 'select',
                label: intl.formatMessage({ id: 'Players.enterClub' }),
                menuItems: this.updateClubsList(),
                required: true
            },
            {
                id: 'lastNameUA',
                label: intl.formatMessage({ id: 'Players.lastNameUA.label' }),
                placeholder: intl.formatMessage({ id: 'Players.lastNameUA.placeholder' }),
                required: true
            },
            {
                id: 'firstNameUA',
                label: intl.formatMessage({ id: 'Players.firstNameUA.label' }),
                placeholder: intl.formatMessage({ id: 'Players.firstNameUA.placeholder' }),
                required: true
            },
            {
                id: 'secondNameUA',
                label: intl.formatMessage({ id: 'Players.secondNameUA.label' }),
                placeholder: intl.formatMessage({ id: 'Players.secondNameUA.placeholder' })
            },
            {
                id: 'born',
                label: intl.formatMessage({ id: 'Players.born.label' }),
                type: 'date',
                required: true
            },
            {
                id: 'citizenship',
                label: intl.formatMessage({ id: 'Players.citizenship.label' }),
                type: 'countries',
                placeholder: intl.formatMessage({ id: 'Players.citizenship.placeholder' }),
                required: true
            },
            {
                type: 'select',
                id: 'licenseType',
                label: intl.formatMessage({ id: 'Players.license.type' }),
                required: true,
                menuItems: [
                    {
                        label: intl.formatMessage({ id: 'Players.license.SENIOR' }),
                        value: 'SENIOR'
                    },
                    {
                        label: intl.formatMessage({ id: 'Players.license.JUNIOR' }),
                        value: 'JUNIOR'
                    }
                ]
            },
            {
                type: 'select',
                id: 'gender',
                label: intl.formatMessage({ id: 'Players.gender.header' }),
                required: true,
                menuItems: [
                    {
                        label: intl.formatMessage({ id: 'Players.gender.MALE' }),
                        value: 'MALE'
                    },
                    {
                        label: intl.formatMessage({ id: 'Players.gender.FEMALE' }),
                        value: 'FEMALE'
                    }
                ]
            },
            {
                id: 'lastNameEN',
                label: intl.formatMessage({ id: 'Players.lastNameEN.label' }),
                placeholder: intl.formatMessage({ id: 'Players.lastNameEN.placeholder' })
            },
            {
                id: 'firstNameEN',
                label: intl.formatMessage({ id: 'Players.firstNameEN.label' }),
                placeholder: intl.formatMessage({ id: 'Players.firstNameEN.placeholder' })
            },
            {
                id: 'height',
                type: 'number',
                label: intl.formatMessage({ id: 'Players.height.header' }),
                placeholder: intl.formatMessage({ id: 'Players.height.header' })
            },
            {
                id: 'weight',
                type: 'number',
                label: intl.formatMessage({ id: 'Players.weight.header' }),
                placeholder: intl.formatMessage({ id: 'Players.weight.header' })
            },
            {
                type: 'select',
                id: 'position',
                label: intl.formatMessage({ id: 'Players.position.header' }),
                menuItems: [
                    {
                        label: intl.formatMessage({ id: 'Players.position.DEFENDER' }),
                        value: 'DEFENDER'
                    },
                    {
                        label: intl.formatMessage({ id: 'Players.position.FORWARD' }),
                        value: 'FORWARD'
                    },
                    {
                        label: intl.formatMessage({ id: 'Players.position.GOALIE' }),
                        value: 'GOALIE'
                    }
                ]
            },
            {
                type: 'select',
                id: 'side',
                label: intl.formatMessage({ id: 'Players.side.header' }),
                menuItems: [
                    {
                        label: intl.formatMessage({ id: 'Players.side.L' }),
                        value: 'L'
                    },
                    {
                        label: intl.formatMessage({ id: 'Players.side.R' }),
                        value: 'R'
                    }
                ]
            }
        ];
    }

    updateClubsList() {
        const { clubsList } = this.props;

        if (clubsList && Object.keys(clubsList).length) {
            return Object.keys(clubsList).map(club => {
                const _c = clubsList[club];

                return {
                    value: club,
                    'data-icon': _c.logoUrl,
                    label: _c.shortNameUA
                };
            });
        } else {
            return [];
        }
    }

    render() {
        const { bem, imagesList, playersData, locale } = this.props,
            { playerEditSchema } = this,
            { logoUrl, clearPhoto } = this.state;
        let content = <Cell offset={5} size={1}>
            Loading...
        </Cell>;

        if (isLoaded(playersData)) {
            const { photo } = playersData;
            let photoUrl = photo && imagesList && imagesList[photo] && imagesList[photo].downloadURL;

            if (clearPhoto) {
                photoUrl = '';
            }

            content = <Grid className={bem.elem('main').cls('row')}>
                <Cell
                    offset={2}
                    size={3}
                    className={bem.elem('main-logo').cls()}>
                    <div className={bem.elem('main-logo-wrapper').cls()}>
                        <img className={bem.elem('main-logo-img').cls()} src={logoUrl || photoUrl} alt=''/>
                    </div>
                    <div className={bem.elem('main-logo-controls').cls()}>
                        <Button
                            flat
                            secondary
                            swapTheming
                            onClick={this.removePhoto}>
                            <FormattedMessage id='Players.removePhoto'/>
                        </Button>
                    </div>
                    <div className={bem.elem('main-logo-controls').cls()}>
                        <PhotoControl
                            alt={playersData.lastNameEN}
                            maxSize={512}
                            maxHeight={500}
                            maxWidth={500}
                            uploadPhotoHandler={this.uploadPhotoHandler}
                            clearPhotoHandler={this.clearPhotoHandler}/>
                    </div>
                </Cell>
                <Cell offset={1} size={4} className={bem.elem('main-info').cls()}>
                    <Form
                        locale={locale}
                        data={playersData}
                        schema={playerEditSchema}
                        submit={this.submit}/>
                </Cell>
            </Grid>;
        }

        return content;
    }

    removePhoto = () => {
        this.setState({
            clearPhoto: true,
            photo: null,
            logoUrl: null
        });
    };

    clearPhotoHandler = () => {
        this.setState({ photo: null, logoUrl: null });
    };

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

        if (this.state.hasOwnProperty('photo')) {
            savedData.photo = photo;
        }

        if (id === 'new') {
            const licenseNumber = playersID + 1;

            savedData.license = licenseNumber;

            await update('counters', { playerID: licenseNumber });
            push('players', savedData)
                .then(this.goToSavedData)
                .catch(this.errorHandler);
        } else {
            update(`players/${id}`, savedData)
                .then(this.goToSavedData)
                .catch(this.errorHandler);
        }
    };

    goToSavedData = data => {
        const { router, params: { id } } = this.props;

        router.push(`/players/${data ? data.key : id}`);
    };

    errorHandler = error => {
        console.log(error.code, error.message);
    }
}

function mapStateToProps(state, props) {
    const { locale, user, firebase: { data: { images, clubs, players, counters } } } = state;

    return {
        locale,
        user,
        clubsList: clubs,
        imagesList: images,
        playersData: players && players[props.params.id],
        playersID: counters && counters.playerID
    };
}

export default compose (
    firebaseConnect(['images', 'clubs', 'players', 'counters']),
    connect(mapStateToProps),
    withRouter,
    injectIntl
)(EditPlayer);
