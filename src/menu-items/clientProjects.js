// assets
import { IconBrandMiniprogram } from '@tabler/icons';

// constant
const icons = { IconBrandMiniprogram };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const clientProjects = {
    id: 'clientprojects',
    type: 'group',
    children: [
        {
            id: 'clientprojects',
            title: 'Projects',
            type: 'item',
            url: '/visumine/client_projects',
            icon: icons.IconBrandMiniprogram,
            breadcrumbs: false
        }
    ]
};

export default clientProjects;
