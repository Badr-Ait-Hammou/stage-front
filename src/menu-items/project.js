// assets
import { IconBrandMiniprogram } from '@tabler/icons';

// constant
const icons = { IconBrandMiniprogram };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const project = {
    id: 'projects',
    type: 'group',
    children: [
        {
            id: 'projects',
            title: 'Projects',
            type: 'item',
            url: '/visumine/projects',
            icon: icons.IconBrandMiniprogram,
            breadcrumbs: false
        }
    ]
};

export default project;
