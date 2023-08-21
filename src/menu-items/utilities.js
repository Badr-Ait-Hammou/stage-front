import { IconTypography, IconPalette, IconShadow, IconWindmill, IconBrandMiniprogram, IconDownload, IconUserPlus } from '@tabler/icons';
import { auth } from "../routes/auth";
/*
// Constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconBrandMiniprogram,
  IconDownload,
  IconUserPlus
};
*/
const filterMenuItems = (user) => {
  const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
      {
        id: 'storage',
        title: 'Storage',
        type: 'item',
        url: '/visumine/storage',
        icon: IconDownload,
        breadcrumbs: false,
      },
      {
        id: 'chart',
        title: 'Chart',
        type: 'item',
        url: '/visumine/chart',
        icon: IconTypography,
        breadcrumbs: false,
      },
      {
        id: 'addUser',
        title: 'Add_User',
        type: 'item',
        url: '/admin/addUser',
        icon: IconUserPlus,
        breadcrumbs: false,
      },
      {
        id: 'addClient',
        title: 'Add_Client',
        type: 'item',
        url: '/visumine/addClient',
        icon: IconUserPlus,
        breadcrumbs: false,
      },
    ],
  };

  if (user === "MANAGER") {
    utilities.children = utilities.children.filter(item => item.id !== 'addUser');
  } else if (user === "ADMIN") {
    utilities.children = utilities.children.filter(item => item.id !== 'addClient');
  }

  return utilities;
};

// Initialize user and utilities
let user = auth.getUserFromLocalCache();
console.log("User from local cache:", user);
let utilities = filterMenuItems(user);

export default utilities;