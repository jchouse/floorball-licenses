import React from 'react';
// import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Grid, Cell } from 'react-md';
import BEM from '../../BEM/BEM';
import PlayersList from '../../Players/List/List.jsx';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, populate } from 'react-redux-firebase';
import './Club.css';

/**
 * Club Card
 */
class Club extends React.Component {
    static defaultProps = {
        bem: new BEM('club-card')
    };

    render() {
        const { bem, clubData, match: { params: { id } } } = this.props;

        let content = '';

        if (clubData) {
            const { address, photo } = clubData;
                // ,
                // meta = {
                //     title: clubData.shortNameUA,
                //     meta: [
                //         { property: 'og:title', content: clubData.shortNameUA },
                //         { property: 'og:url', content: document.location.href },
                //         { property: 'og:image', content: photo && photo.key }
                //     ]
                // };

            content = (
                <div className={bem.elem('main').cls()}>
                    {/* <Helmet {...meta}/> */}
                    <Grid className={bem.elem('players').cls()}>
                        <Cell size={4} className={bem.elem('main-logo').cls()}>
                            {photo && <img className={bem.elem('main-logo-img').cls()} src={photo.downloadURL} alt={clubData.shortNameUA}/>}
                        </Cell>
                        <Cell size={6} className={bem.elem('main-info').cls()}>
                            <div className={bem.elem('info').cls()}>
                                <div className={bem.elem('info-text').mods('label').cls()}>
                                    <FormattedMessage id='Clubs.fullName'/>
                                </div>
                                <div className={bem.elem('info-text').mods('main').cls()}>
                                    {clubData.fullNameUA}
                                </div>
                                <div className={bem.elem('info-text').mods('add').cls()}>
                                    {clubData.fullNameEN}
                                </div>
                            </div>
                            <div className={bem.elem('info').cls()}>
                                <div className={bem.elem('info-text').mods('label').cls()}>
                                    <FormattedMessage id='Clubs.shortName'/>
                                </div>
                                <div className={bem.elem('info-text').mods('main').cls()}>
                                    {clubData.shortNameUA}
                                </div>
                                <div className={bem.elem('info-text').mods('add').cls()}>
                                    {clubData.shortNameEN}
                                </div>
                            </div>
                            {clubData.phone && <div className={bem.elem('info').cls()}>
                                <div className={bem.elem('info-text').mods('label').cls()}>
                                    <FormattedMessage id='Clubs.contactPhone'/>
                                </div>
                                <div className={bem.elem('info-text').mods('add').cls()}>
                                    {clubData.phone}
                                </div>
                            </div>}
                            {clubData.email && <div className={bem.elem('info').cls()}>
                                <div className={bem.elem('info-text').mods('label').cls()}>
                                    <FormattedMessage id='Clubs.email'/>
                                </div>
                                <a href={`mailto:${clubData.email}`} className={bem.elem('info-text').mods('add').cls()}>
                                    {clubData.email}
                                </a>
                            </div>}
                            {address.line && <div className={bem.elem('info').cls()}>
                                <div className={bem.elem('info-text').mods('label').cls()}>
                                    <FormattedMessage id='Clubs.address'/>
                                </div>
                                <div className={bem.elem('info-text').mods('main').cls()}>
                                    {[address.line, address.city, address.country, address.postCode].join(', ')}
                                </div>
                            </div>}
                        </Cell>
                    </Grid>
                    <Grid className={bem.elem('players').cls()}>
                        <Cell size={10}>
                            <h4 className={bem.elem('players-header').cls('md-title')}>
                                <FormattedMessage id='Clubs.players'/>
                            </h4>
                        </Cell>
                    </Grid>
                    <PlayersList club={id}/>
                </div>
            );
        } else {
            content = (
                <div className='progress'>
                    <div className='indeterminate'/>
                </div>
            );
        }

        return (
            <div className={bem.cls('container')}>
                {content}
            </div>
        );
    }
}

const populates = [
    { child: 'photo', root: 'images', keyProp: 'key' }
];

function mapStateToProps(state, props) {
    const { firebase, firebase: { data: { clubs } } } = state;
    let clubsList;

    if (clubs) {
        clubsList = populate(firebase, 'clubs', populates);
    }

    return {
        clubData: clubsList && clubsList[props.match.params.id]
    };
}

export default compose(
    firebaseConnect([{
        path: 'clubs', populates
    }]),
    connect(mapStateToProps)
)(Club);
