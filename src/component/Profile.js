import { Card } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import LinkIcon from '@mui/icons-material/Link';

export default function Profile(){
    return(
        <MainCard title="Profile" secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} />}>
            <Card sx={{ overflow: 'hidden' }}>
            </Card>
        </MainCard>
    );
}

