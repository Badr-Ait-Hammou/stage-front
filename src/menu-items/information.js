// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const information = {
    id: 'information',
    type: 'group',
    children: [
        {
            id: 'information',
            title: 'Information',
            type: 'item',
            url: '/information/information',
            icon: icons.IconDashboard,
            breadcrumbs: false}]
};

export default information;
