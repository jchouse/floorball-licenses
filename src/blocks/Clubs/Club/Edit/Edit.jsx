import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import { Grid, Cell } from 'react-md';
import Form from '../../../../components/Form/Form.jsx';
import BEM from '../../../../components/BEM/BEM';
import PhotoControl from '../../../../components/Photo/Control/Control.jsx';
import './Edit.css';

/**
 * Edit Club
 */
class EditClub extends React.Component {
    static defaultProps = {
        bem: new BEM('edit-club')
    };

    state = {};

    get clubData() {
        return {
            shortNameEN: '',
            shortNameUA: '',
            fullNameEN: '',
            fullNameUA: '',
            logo: '',
            address: {
                line: '',
                city: '',
                country: '',
                postCode: ''
            },
            photosList: [],
            phone: '',
            email: '',
            url: ''
        };
    }

    get clubEditSchema() {
        return [
            {
                id: 'fullNameUA',
                label: 'Full Name',
                required: true
            },
            {
                id: 'fullNameEN',
                label: 'Full english Name',
                required: true
            },
            {
                id: 'shortNameUA',
                label: 'Short Name',
                required: true
            },
            {
                id: 'shortNameEN',
                label: 'Short english Name',
                required: true
            },
            {
                id: 'phone',
                label: 'Contact phone',
                required: true
            },
            {
                id: 'email',
                label: 'E-mail',
                required: true
            },
            {
                fieldset: {
                    label: 'Address',
                    name: 'address',
                    fields: [
                        {
                            id: 'line',
                            label: 'Line',
                            required: true
                        },
                        {
                            id: 'city',
                            label: 'City',
                            required: true
                        },
                        {
                            id: 'country',
                            label: 'Country',
                            required: true
                        },
                        {
                            id: 'postCode',
                            label: 'Postal Code',
                            required: true
                        }
                    ]
                }
            }
        ];
    }

    render() {
        const { bem, imagesList, clubData = this.clubData, params: { id } } = this.props,
            { logoUrl } = this.state;
        let content = 'Loading';

        if (id === 'new' || isLoaded(clubData)) {
            const { photo } = clubData,
                logo =  photo && imagesList && imagesList[photo] && imagesList[photo].downloadURL;

            content = <div className={bem.cls()}>
                <Grid className={bem.elem('main').cls()}>
                    <Cell size={4} offset={2}>
                        <img className={bem.elem('main-logo').cls()} src={logoUrl || logo} alt={clubData.shortNameEN}/>
                        <PhotoControl
                            alt={clubData.shortNameEN}
                            uploadPhotoHandler={this.uploadPhotoHandler}/>
                    </Cell>
                    <Cell size={4} className={bem.elem('main-info').cls()}>
                        <Form
                            data={clubData}
                            schema={this.clubEditSchema}
                            submit={this.submit}/>
                    </Cell>
                </Grid>
            </div>;
        }

        return content;
    }

    uploadPhotoHandler = (photo, url) => {
        this.setState({
            logoUrl: url,
            photo
        });
    };

    submit = data => {
        const { firebase: { push, update }, clubData, params: { id } } = this.props,
            { photo } = this.state,
            savedData = { ...clubData, ...data };

        if (photo) {
            savedData.photo = photo;
        }

        if (id === 'new') {
            push('clubs', savedData).then(this.goToSavedData);
        } else {
            update(`clubs/${id}`, savedData).then(this.goToSavedData);
        }
    };

    goToSavedData = data => {
        const { router, params: { id } } = this.props;

        router.push(`/clubs/${data ? data.key : id}`);
    }
}

function mapStateToProps(state, props) {
    const { firebase: { data: { images, clubs } } } = state;

    return {
        imagesList: images,
        clubData: clubs && clubs[props.params.id]
    };
}

export default compose (
    firebaseConnect(['images', 'clubs']),
    connect(mapStateToProps),
    withRouter
)(EditClub);
