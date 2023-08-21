// assets
import { IconInfoCircle } from '@tabler/icons';

// constant
const icons = { IconInfoCircle };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const clientProjects = {
    id: 'aboutus',
    type: 'group',
    children: [
        {
            id: 'aboutus',
            title: 'About Us',
            type: 'item',
            url: '/visumine/aboutUs',
            icon: icons.IconInfoCircle,
            breadcrumbs: false
        }
    ]
};

export default clientProjects;
