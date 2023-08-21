import React from 'react';
import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import {auth} from "../../../../routes/auth";


let userType = auth.getUserFromLocalCache();
console.log("User from local cache:", userType);


const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    if (userType === "CLIENT" && item.id !== 'myProfile') {
      return null;
    }

    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
