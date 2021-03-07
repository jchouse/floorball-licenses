import React from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu, Avatar, Button, AccessibleFakeButton } from 'react-md';
import User from '../User/User.jsx';
import BEM from '../../BEM/BEM';
import './KebabMenu.css';

const KebabMenu = ({ className, menuItems, id, user }) => {
    const bem = new BEM('kebab-menu');

    let button = <Button icon>more_vert</Button>;

    if (user) {
        const { photoURL, displayName } = user;

        if (photoURL || displayName) {
            button = <AccessibleFakeButton>
                <Avatar
                    className={bem.elem('avatar').cls()}
                    src={photoURL}
                    random>
                    {displayName.slice(0,1)}
                </Avatar>
            </AccessibleFakeButton>;
        }
    }

    return <DropdownMenu
        id={id}
        anchor={{
            x: DropdownMenu.HorizontalAnchors.INNER_RIGHT,
            y: DropdownMenu.VerticalAnchors.BOTTOM
        }}
        className={className}
        menuItems={[<User key='user' user={user}/>, ...menuItems]}>
        {button}
    </DropdownMenu>;
};

KebabMenu.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    menuItems: PropTypes.array
};

export default KebabMenu;
