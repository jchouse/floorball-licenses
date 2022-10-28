import React from 'react';
import { Roles } from '../../constans/settings';

export const RolesContext = React.createContext({
  role: Roles.GUEST,
  setRole: (role: Roles) => {},
});
