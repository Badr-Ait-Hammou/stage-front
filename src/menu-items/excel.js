// assets
import { IconFileSpreadsheet } from '@tabler/icons';

// constant
const icons = { IconFileSpreadsheet };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const excel = {
  id: 'excel',
  type: 'group',
  children: [
    {
      id: 'excel',
      title: 'Excel File',
      type: 'item',
      url: '/app/excel',
      icon: icons.IconFileSpreadsheet,
      breadcrumbs: false
    }
  ]
};

export default excel;
