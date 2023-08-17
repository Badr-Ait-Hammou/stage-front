// assets
import { IconFileDescription } from '@tabler/icons';

// constant
const icons = { IconFileDescription };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const pdf = {
  id: 'pdf',
  type: 'group',
  children: [
    {
      id: 'pdf',
      title: 'Pdf File',
      type: 'item',
      url: '/app/pdf',
      icon: icons.IconFileDescription,
      breadcrumbs: false
    }
  ]
};

export default pdf;
