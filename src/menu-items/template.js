// assets
import { IconTemplate } from '@tabler/icons';

// constant
const icons = { IconTemplate };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const annotation = {
    id: 'template',
    type: 'group',
    children: [
        {
            id: 'template',
            title: 'Template',
            type: 'item',
            url: '/app/template',
            icon: icons.IconTemplate,
            breadcrumbs: false
        }
    ]
};

export default annotation;
