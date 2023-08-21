// assets
import { IconUser } from '@tabler/icons';

// constant
const icons = { IconUser };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const myProfile = {
    id: 'myProfile',
    type: 'group',
    children: [
        {
            id: 'myProfile',
            title: 'My Profile',
            type: 'item',
            url: '/visumine/profile',
            icon: icons.IconUser,
            breadcrumbs: false
        }
    ]
};

export default myProfile;
