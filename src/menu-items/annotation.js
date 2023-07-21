// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const annotation = {
    id: 'annotation',
    type: 'group',
    children: [
        {
            id: 'annotation',
            title: 'annotation',
            type: 'item',
            url: '/annotation/annotation',
            icon: icons.IconDashboard,
            breadcrumbs: false
        }
    ]
};

export default annotation;
