import React from 'react';
import { FontIcon, ListItem } from 'react-md';
import { Link } from 'react-router';

const NavItemLink = ({ to, label, icon, onClick }) => {
  let leftIcon;

  if (icon) {
    leftIcon = <FontIcon>{icon}</FontIcon>;
  }

  return <ListItem
    component={Link}
    active={true}
    to={to}
    primaryText={label}
    leftIcon={leftIcon}
    onClick={onClick}/>;
};

export default NavItemLink;
