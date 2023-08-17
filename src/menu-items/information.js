// assets
import { IconInfoSquare } from '@tabler/icons';
// constant
const icons = { IconInfoSquare };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const information = {
    id: 'information',
    type: 'group',
    children: [
        {
            id: 'information',
            title: 'Information',
            type: 'item',
            url: '/app/information',
            icon: icons.IconInfoSquare,
            breadcrumbs: false}]
};

export default information;
