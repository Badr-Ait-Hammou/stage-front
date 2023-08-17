// assets
import { IconPhoto } from '@tabler/icons';

// constant
const icons = { IconPhoto };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const image = {
    id: 'image',
    type: 'group',
    children: [
        {
            id: 'image',
            title: 'Images',
            type: 'item',
            url: '/app/image',
            icon: icons.IconPhoto,
            breadcrumbs: false
        }
    ]
};

export default image;
