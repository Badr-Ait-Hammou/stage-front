// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill,IconBrandMiniprogram,IconDownload,IconUserPlus } from '@tabler/icons';
// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconBrandMiniprogram,
  IconDownload,
  IconUserPlus
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'storage',
      title: 'Storage',
      type: 'item',
      url: '/app/storage',
      icon: icons.IconDownload,
      breadcrumbs: false
    },{
      id: 'chart',
      title: 'Chart',
      type: 'item',
      url: '/app/chart',
      icon: icons.IconTypography,
      breadcrumbs: false
    },
    {
      id: 'addUser',
      title: 'Add_User',
      type: 'item',
      url: '/app/addUser',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'addClient',
      title: 'Add_Client',
      type: 'item',
      url: '/app/addClient',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },

    /*{
      id: 'util-typography',
      title: 'Typography',
      type: 'item',
      url: '/utils/util-typography',
      icon: icons.IconTypography,
      breadcrumbs: false
    },
    {
      id: 'util-color',
      title: 'Color',
      type: 'item',
      url: '/utils/util-color',
      icon: icons.IconPalette,
      breadcrumbs: false
    },
    {
      id: 'util-shadow',
      title: 'Shadow',
      type: 'item',
      url: '/utils/util-shadow',
      icon: icons.IconShadow,
      breadcrumbs: false
    },
    {
      id: 'icons',
      title: 'Icons',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'tabler-icons',
          title: 'Tabler Icons',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'material-icons',
          title: 'Material Icons',
          type: 'item',
          external: true,
          target: '_blank',
          url: 'https://mui.com/material-ui/material-icons/',
          breadcrumbs: false
        }
      ]
    }*/
  ]
};

export default utilities;
