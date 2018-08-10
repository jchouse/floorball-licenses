import React from 'react';
import PropTypes from 'prop-types';
import BEM from '../../../components/BEM/BEM';
import { ListItem } from 'react-md';
import './User.css';

const User = ({ user, bem }) => {
    const { email, displayName = 'Guest' } = user;

    return (
        <ListItem
            primaryText={displayName}
            secondaryText={email}/>);
};

User.propTypes = {
    user: PropTypes.object.isRequired,
    bem: PropTypes.object
};

User.defaultProps = {
    bem: new BEM('user')
};

export default User;
