// assets
import { IconPencil } from '@tabler/icons';

// constant
const icons = { IconPencil };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const annotation = {
    id: 'annotation',
    type: 'group',
    children: [
        {
            id: 'annotation',
            title: 'annotation',
            type: 'item',
            url: '/annotation',
            icon: icons.IconPencil,
            breadcrumbs: false
        }
    ]
};

export default annotation;
