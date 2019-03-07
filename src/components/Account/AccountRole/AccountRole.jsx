import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { Autocomplete, SelectField, Button } from 'react-md';
import { FormattedMessage } from 'react-intl';
import { ClubsListDropdown } from '../../Clubs/ClubsListDropdown/ClubsListDropdown';
import BEM from '../../BEM/BEM';
import './AccountRole.css';

class AccountRole extends Component {
    static defaultProps = {
        bem: new BEM('account-role'),
        playersList: {}
    };

    static getRole(user, clubs, locale) {
        const { role, clubId } = user;
        let message = {
            id: 'Account.base'
        };

        if (role > 20 && role < 31) {
            let clubName = '';

            if (isLoaded(clubs) && clubId) {
                const { shortNameEN, shortNameUA } = clubs[clubId];

                clubName = locale === 'en' ? shortNameEN : shortNameUA;
            }

            message = {
                id: 'Account.clubAdmin',
                values: { clubName }
            };
        } else if (role > 30 && role < 90) {
            message = {
                id: 'Account.financeAdmin'
            };
        } else if (role > 90) {
            message = {
                id: 'Account.mainAdmin'
            };
        }

        return <FormattedMessage {...message}/>;
    }

    state = {
        autocompleteHandler: () => {},
        confirmHandler: () => {},
        viewChooseUserDialogue: false,
        chosedUser: null
    };

    render() {
        return ([
            // this.renderAdmins(),
            this.renderClubRepresentative()
        ]);
    }

    renderAdmins() {
        const { bem } = this.props;

        return (
            <div className={bem.elem('item').cls()} key='admins'>
                <h3 className={bem.elem('item-header').cls('md-display-1')}>List of admins.</h3>
                <ul>
                    <li>
                        License admin:
                    </li>
                    <li>
                        Tresurer:
                    </li>
                </ul>
            </div>
        );
    }

    renderClubRepresentative() {
        const { bem } = this.props,
            { selectedClub, viewChooseUserDialogue, chosedUser } = this.state;

        return (
            <div className={bem.elem('item').mods('repr').cls()} key='clubs-representative'>
                <h3 className={bem.elem('item-header').cls('md-display-1')}>
                    <FormattedMessage id='Account.clubsAdmin'/>
                </h3>
                <div>
                    {this.renderClubDropdown()}
                    <h4 className={bem.cls('md-headline')}>
                        <FormattedMessage id='Account.selectedAdmin'/>
                    </h4>
                    <div className={bem.elem('club-admin-text').mods(chosedUser && 'removed').cls()}>
                        {this.findClubAdmin()}
                    </div>
                    {!viewChooseUserDialogue &&
                        <div>
                            <Button
                                flat
                                disabled={!selectedClub}
                                iconChildren='edit'
                                onClick={this.showChooseUserDialogue}>
                                <FormattedMessage id='Account.changeClubAdmin'/>
                            </Button>
                        </div>}
                    {viewChooseUserDialogue && this.renderChooseUserDialogue()}
                </div>

            </div>
        );
    }

    showChooseUserDialogue = () => {
        this.setState({
            viewChooseUserDialogue: true,
            autocompleteHandler: this.selectClubAdminAutocompleteHandler,
            confirmHandler: this.clubAdminModalConfirmHandler
        });
    };

    findClubAdmin() {
        const { users } = this.props,
            { selectedClub } = this.state;
        let admin = <FormattedMessage id='Account.selectClubFirst'/>,
            user;

        if (selectedClub) {
            user = Object.values(users).find(user => {
                if (user.clubId === selectedClub) {
                    return true;
                } else {
                    return null;
                }
            });

            admin = <FormattedMessage id='Account.noCurrentAdmin'/>;
        }

        if (user) {
            const { displayName, email } = user;

            admin = this.renderUserInfo(displayName, email);
        }

        return admin;
    }

    renderUserInfo(displayName, email) {
        return (
            <div>
                <div>
                    {'Display name: '}
                    {displayName}
                </div>
                <div>
                    {'E-mail: '}
                    {email}
                </div>
            </div>
        );
    }

    renderClubDropdown() {
        const { bem, clubs } = this.props,
            { selectedClub } = this.state;
        let clubsList = [];

        if (isLoaded(clubs)) {
            clubsList = ClubsListDropdown(clubs);
        }

        return (
            <SelectField
                value={selectedClub}
                label='Select club'
                id='club-selector'
                className={bem.elem('input').cls()}
                menuItems={clubsList}
                onChange={this.selectCLub}/>
        );
    }

    selectCLub = clubId => {
        this.setState({
            selectedClub: clubId
        });
    };

    renderChooseUserDialogue() {
        const { chosedUser } = this.state,
            { bem, users } = this.props,
            selectedUser = chosedUser && users[chosedUser.data];
        let usersForSelect = [],
            chosedUserInfo = {};

        if (isLoaded(users)) {
            usersForSelect = Object.entries(users).map(([userKey, user]) => ({
                data: userKey,
                primaryText: user.email || ''
            }));
        }

        if (selectedUser && isLoaded(users)) {
            chosedUserInfo = users[chosedUser.data];
        }

        return (
            <div className={bem.elem('input').cls()}>
                <Autocomplete
                    id='clubs-players'
                    label='Users email'
                    placeholder='Please type email'
                    autocompleteWithLabel={true}
                    data={usersForSelect}
                    listHeightRestricted={true}
                    onAutocomplete={this.state.autocompleteHandler}/>
                {selectedUser && this.renderUserInfo(chosedUserInfo.displayName, chosedUserInfo.email)}
                {this.renderChooseUserModalActions()}
            </div>
        );
    }

    selectClubAdminAutocompleteHandler = (suggestion, suggestionIndex, matches) => {
        this.setState({
            chosedUser: matches[suggestionIndex]
        });
    };

    renderChooseUserModalActions() {
        const { chosedUser } = this.state;

        return (
            <Button
                flat
                disabled={!(chosedUser &&  chosedUser.data)}
                onClick={this.state.confirmHandler}>
                confirm
            </Button>
        );
    }

    clubAdminModalConfirmHandler = async() => {
        const { users, firebase: { update } } = this.props,
            { selectedClub, chosedUser: { data: chosedUserId } } = this.state,
            [currentClubAdminKey, { clubId, role, ...oldAdminDataWithoutRole }] = Object.entries(users)
                .find(([, data]) => selectedClub === data.clubId),
            newClubAdmin = users[chosedUserId];

        await update('users', {
            [`${currentClubAdminKey}`]: oldAdminDataWithoutRole,
            [`${chosedUserId}`]: { ...newClubAdmin, clubId, role }
        });

        this.setState({
            chosedUser: null,
            viewChooseUserDialogue: false
        });
    };

    hideHandler = () => {
        this.setState({
            viewChooseUserDialogue: false
        });
    }
}

function mapStateToProps(state) {
    const { user, locale, firebase: { data: { users, clubs } } } = state;

    return {
        user,
        clubs,
        users,
        locale
    };
}

export default compose(
    firebaseConnect(['users', 'clubs']),
    connect(mapStateToProps)
)(AccountRole);
