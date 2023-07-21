// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const image = {
    id: 'image',
    type: 'group',
    children: [
        {
            id: 'image',
            title: 'Images',
            type: 'item',
            url: '/image/image',
            icon: icons.IconDashboard,
            breadcrumbs: false
        }
    ]
};

export default image;
