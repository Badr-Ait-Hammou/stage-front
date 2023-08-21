import React from 'react';
import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import {auth} from "../../../../routes/auth";


let userType = auth.getUserFromLocalCache();
console.log("User from local cache:", userType);

const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    if (userType === "CLIENT") {
      if (item.id === 'myProfile' || item.id === 'clientprojects'|| item.id === 'aboutus') {
        return <NavGroup key={item.id} item={item} />;
      } else {
        return null;
      }
    } else if (userType === "MANAGER" || userType === "ADMIN") {
      if (item.id !== 'clientprojects' && item.id !== 'aboutus') {
        return <NavGroup key={item.id} item={item} />;
      } else {
        return null;
      }
    }

    return (
        <Typography key={item.id} variant="h6" color="error" align="center">
          Menu Items Error
        </Typography>
    );
  });

  return <>{navItems}</>;
};


export default MenuList;
