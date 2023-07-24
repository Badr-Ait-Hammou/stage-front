// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill,IconBrandMiniprogram,IconDownload } from '@tabler/icons';
// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconBrandMiniprogram,
  IconDownload
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'projects',
      title: 'Projects',
      type: 'item',
      url: '/projects',
      icon: icons.IconBrandMiniprogram,
      breadcrumbs: false
    }, {
      id: 'storage',
      title: 'Storage',
      type: 'item',
      url: '/storage',
      icon: icons.IconDownload,
      breadcrumbs: false
    }, {
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
    }
  ]
};

export default utilities;
