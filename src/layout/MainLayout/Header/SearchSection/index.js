import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';


// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper } from '@mui/material';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';
import {auth} from "../../../../routes/auth";
import Alert from '@mui/material/Alert';
import React from "react";

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
    zIndex: 1100,
    width: '99%',
    top: '-55px !important',
    padding: '0 12px',
    [theme.breakpoints.down('sm')]: {
        padding: '0 10px'
    }
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    '&:hover': {
        background: theme.palette.secondary.dark,
        color: theme.palette.secondary.light
    }
}));

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = ({  popupState }) => {
    const theme = useTheme();

    const [filterValue, setFilterValue] = useState('');

    let userRole = auth.getUserFromLocalCache();
    let searchOptions;


    const searchResults = [
        { name: 'Projects', link: '/visumine/projects' },
        { name: 'Images', link: '/visumine/images' },
        { name: 'Profile', link: '/visumine/profile' },
        { name: 'Template', link: '/visumine/template' },
        { name: 'Information', link: '/visumine/information' },
        { name: 'add user', link: '/admin/addUser' }
        // Add more items as needed
    ];
    const searchResultsManager = [
        { name: 'Projects', link: '/visumine/projects' },
        { name: 'Images', link: '/visumine/images' },
        { name: 'Profile', link: '/visumine/profile' },
        { name: 'Template', link: '/visumine/template' },
        { name: 'Information', link: '/visumine/information' },
        { name: 'add client', link: '/visumine/addClient' }
        // Add more items as needed
    ];

    const searchResultsClient = [
        { name: 'Projects', link: '/visumine/client_projects' },
        { name: 'Profile', link: '/visumine/profile' },
        { name: 'About us', link: '/visumine/aboutUs' },
    ];

    if (userRole === "ADMIN") {
        searchOptions = searchResults;
    } else if (userRole === "CLIENT") {
        searchOptions = searchResultsClient;
    } else if (userRole === "MANAGER") {
        searchOptions = searchResultsManager;
    }

    const filteredResults = searchOptions.filter(result =>
        result.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    const handleLinkClick = () => {
        setFilterValue('');
    };

    return (
        <Box>
        <OutlineInputStyle
            id="input-search-header"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Search"
            startAdornment={
                <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <ButtonBase sx={{ borderRadius: '12px' }}>
                        <HeaderAvatarStyle variant="rounded">
                            <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
                        </HeaderAvatarStyle>
                    </ButtonBase>
                    <Box sx={{ ml: 2 }}>
                        <ButtonBase sx={{ borderRadius: '12px' }}>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    background: theme.palette.orange.light,
                                    color: theme.palette.orange.dark,
                                    '&:hover': {
                                        background: theme.palette.orange.dark,
                                        color: theme.palette.orange.light
                                    }
                                }}
                                {...bindToggle(popupState)}
                            >
                                <IconX stroke={1.5} size="1.3rem" />
                            </Avatar>
                        </ButtonBase>
                    </Box>
                </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{ 'aria-label': 'weight' }}
        />
            {/* Display filtered search results */}
            {filterValue && (
                <Card sx={{ background: '#fff', zIndex: 9999, position: 'absolute',width:"87%" }}>
                    <Box sx={{ p: 2 }}>
                        {filteredResults.length > 0 ? (
                            filteredResults.map(result => (
                                <div className="mb-2" key={result.link}>
                                    <Alert variant="outlined" severity="success">
                                        <Link to={result.link} onClick={handleLinkClick}>
                                            {result.name}
                                        </Link>
                                    </Alert>
                                </div>
                            ))
                        ) : (
                            <Alert variant="filled" severity="error">
                                oops ! try something else
                            </Alert>
                        )}
                    </Box>
                </Card>
            )}
        </Box>

    );
};

MobileSearch.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    popupState: PopupState
};

// ==============================|| SEARCH INPUT ||============================== //
const SearchSection = () => {
    const theme = useTheme();
    const [value, setValue] = useState('');
    const [filterValue, setFilterValue] = useState('');
    let userRole = auth.getUserFromLocalCache();
    let searchOptions;


    const searchResults = [
        { name: 'Projects', link: '/visumine/projects' },
        { name: 'Images', link: '/visumine/images' },
        { name: 'Profile', link: '/visumine/profile' },
        { name: 'Template', link: '/visumine/template' },
        { name: 'Information', link: '/visumine/information' },
        { name: 'add user', link: '/admin/addUser' }
        // Add more items as needed
    ];
    const searchResultsManager = [
        { name: 'Projects', link: '/visumine/projects' },
        { name: 'Images', link: '/visumine/images' },
        { name: 'Profile', link: '/visumine/profile' },
        { name: 'Template', link: '/visumine/template' },
        { name: 'Information', link: '/visumine/information' },
        { name: 'add client', link: '/visumine/addClient' }
    ];

    const searchResultsClient = [
        { name: 'Projects', link: '/visumine/client_projects' },
        { name: 'Profile', link: '/visumine/profile' },
        { name: 'About us', link: '/visumine/aboutUs' },
    ];

    if (userRole === "ADMIN") {
        searchOptions = searchResults;
    } else if (userRole === "CLIENT") {
        searchOptions = searchResultsClient;
    } else if (userRole === "MANAGER") {
        searchOptions = searchResultsManager;
    }

    const filteredResults = searchOptions.filter(result =>
        result.name.toLowerCase().includes(filterValue.toLowerCase())
    );


    const handleLinkClick = () => {
        setFilterValue('');
    };



    return (
        <>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <PopupState variant="popper" popupId="demo-popup-popper">
                    {(popupState) => (
                        <>
                            <Box sx={{ ml: 2 }}>
                                <ButtonBase sx={{ borderRadius: '12px' }}>
                                    <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                                        <IconSearch stroke={1.5} size="1.2rem" />
                                    </HeaderAvatarStyle>
                                </ButtonBase>
                            </Box>
                            <PopperStyle {...bindPopper(popupState)} transition>
                                {({ TransitionProps }) => (
                                    <>
                                        <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                                            <Card
                                                sx={{
                                                    background: '#fff',
                                                    [theme.breakpoints.down('sm')]: {
                                                        border: 0,
                                                        boxShadow: 'none'
                                                    }
                                                }}
                                            >
                                                <Box sx={{ p: 2 }}>
                                                    <Grid container alignItems="center" justifyContent="space-between">
                                                        <Grid item xs>
                                                            <MobileSearch value={value} setValue={setValue} popupState={popupState} />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Card>
                                        </Transitions>
                                    </>
                                )}
                            </PopperStyle>
                        </>
                    )}
                </PopupState>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <OutlineInputStyle
                    id="input-search-header"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Search"
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <ButtonBase sx={{ borderRadius: '12px' }}>
                                <HeaderAvatarStyle variant="rounded">
                                    <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
                                </HeaderAvatarStyle>
                            </ButtonBase>
                        </InputAdornment>
                    }
                    aria-describedby="search-helper-text"
                    inputProps={{ 'aria-label': 'weight' }}
                />
                {/* Display filtered search results */}
                {filterValue && (
                    <Card sx={{ background: '#fff', zIndex: 9999, position: 'absolute',width:"27%" }}>
                        <Box sx={{ p: 2 }}>
                            {filteredResults.length > 0 ? (
                                filteredResults.map(result => (
                                    <div className="mb-2" key={result.link}>
                                        <Alert variant="outlined" severity="success">
                                        <Link to={result.link} onClick={handleLinkClick}>
                                            {result.name}
                                        </Link>
                                        </Alert>
                                    </div>
                                ))
                            ) : (
                                <Alert variant="filled" severity="error">
                                    oops ! try something else
                                </Alert>
                            )}
                        </Box>
                    </Card>
                )}
            </Box>
        </>
    );
};

export default SearchSection;
