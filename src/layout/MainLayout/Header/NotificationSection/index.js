import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid, ListItem, ListItemAvatar, ListItemText,
  Paper,
  Popper,
  Stack,Badge,
  TextField,
  Typography,
  useMediaQuery,

  List, ListItemSecondaryAction,
} from '@mui/material';


// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconBell } from '@tabler/icons';
import User1 from "../../../../assets/images/users/user-round.svg";

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '&:hover': {
    background: theme.palette.primary.light
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}));
// notification status options
const status = [
  {
    value: 'read',
    label: 'Read'
  },
  {
    value: 'unread',
    label: 'Unread'
  },

];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };


  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light
  };
  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 20
  };
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();


    }
      fetchReadNotifications();
      fetchUnreadNotifications();
    fetchUnreadNotificationCount();
    const pollingInterval = 60000;
    const intervalId = setInterval(fetchUnreadNotificationCount, pollingInterval);
    return () => clearInterval(intervalId);

  }, [open]);



  const [selectedStatus, setSelectedStatus] = useState('unread');
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);


  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/comment/status/unread');
      const data = await response.json();
      setUnreadNotifications(data);

    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };



    const fetchUnreadNotificationCount = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/comment/status/unread');
            const data = await response.json();
            setUnreadNotificationCount(data.length);
        } catch (error) {
            console.error('Error fetching unread notification count:', error);
        }
    };


  const fetchReadNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/comment/status/read');
      const data = await response.json();
      setReadNotifications(data);
    } catch (error) {
      console.error('Error fetching read notifications:', error);
    }
  };



  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <ButtonBase sx={{ borderRadius: '12px' }}>
          <Badge badgeContent={unreadNotificationCount} color="error">
            <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  transition: 'all .2s ease-in-out',
                  background: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                  '&[aria-controls="menu-list-grow"],&:hover': {
                    background: theme.palette.secondary.dark,
                    color: theme.palette.secondary.light
                  }
                }}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="inherit"
            >
              <IconBell stroke={1.5} size="1.3rem" />
            </Avatar>
          </Badge>
        </ButtonBase>
      </Box>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 10 }}>
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">All Notification</Typography>

                          </Stack>
                        </Grid>

                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}>
                        <Grid container direction="column" spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ px: 2, pt: 0.25 }}>
                              <TextField
                                id="outlined-select-currency-native"
                                select
                                fullWidth
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                SelectProps={{
                                  native: true
                                }}
                              >
                                {status.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </TextField>
                             </Box>
                          </Grid>
                          <Grid item xs={12} p={0}>
                            <Divider sx={{ my: 0 }} />
                          </Grid>
                        </Grid>


                        {selectedStatus === 'read' ? (
                            readNotifications.map(notification => (
                                <List
                                    sx={{
                                      width: '100%',
                                      maxWidth: 330,
                                      py: 0,
                                      borderRadius: '10px',
                                      [theme.breakpoints.down('md')]: {
                                        maxWidth: 300
                                      },
                                      '& .MuiListItemSecondaryAction-root': {
                                        top: 22
                                      },
                                      '& .MuiDivider-root': {
                                        my: 0
                                      },
                                      '& .list-container': {
                                        pl: 7
                                      }
                                    }}
                                >
                                <ListItemWrapper key={notification.id}>

                                  <ListItem alignItems="center">
                                    <ListItemAvatar>
                                      <Avatar alt={notification.author} src={User1} />
                                    </ListItemAvatar>

                                    <ListItemText primary={<Typography variant="subtitle1"   >{notification.user.firstName}</Typography>} />
                                    <ListItemSecondaryAction>
                                      <Grid container justifyContent="flex-end">
                                        <Grid item xs={12}>
                                          <Typography variant="caption" display="block">
                                            {formatDistanceToNow(new Date(notification.commentDate), { addSuffix: true })}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </ListItemSecondaryAction>
                                  </ListItem>

                                  <Grid container direction="column" className="list-container">
                                    <Grid item xs={12} sx={{ pb: 2 }}>
                                      <Typography variant="subtitle2" className="font-bold">{notification.note}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Grid container>

                                        <Grid item>
                                          <Chip label={notification.status} sx={chipSuccessSX} />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </ListItemWrapper>
                                    <Divider />
                                </List>
                            ))
                        ) : (
                            unreadNotifications.map(notification => (
                                <List
                                    sx={{
                                      width: '100%',
                                      maxWidth: 330,
                                      py: 0,
                                      borderRadius: '10px',
                                      [theme.breakpoints.down('md')]: {
                                        maxWidth: 300
                                      },
                                      '& .MuiListItemSecondaryAction-root': {
                                        top: 22
                                      },
                                      '& .MuiDivider-root': {
                                        my: 0
                                      },
                                      '& .list-container': {
                                        pl: 7
                                      }
                                    }}
                                >
                                  <ListItemWrapper key={notification.id}>
                                    <ListItem alignItems="center">
                                      <ListItemAvatar>
                                        <Avatar alt={notification.author} src={User1} />
                                      </ListItemAvatar>

                                      <ListItemText primary={<Typography variant="subtitle1"   >{notification.user.firstName}</Typography>} />
                                      <ListItemSecondaryAction>
                                        <Grid container justifyContent="flex-end">
                                          <Grid item xs={12}>
                                            <Typography variant="caption" display="block">
                                              {formatDistanceToNow(new Date(notification.commentDate), { addSuffix: true })}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </ListItemSecondaryAction>
                                    </ListItem>

                                    <Grid container direction="column" className="list-container">
                                      <Grid item xs={12} sx={{ pb: 2 }}>
                                        <Typography variant="subtitle2" className="font-bold">{notification.note}</Typography>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Grid container>

                                          <Grid item>
                                            <Chip label={notification.status} sx={chipWarningSX} />
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>


                                  </ListItemWrapper>
                                  <Divider />

                                </List>
                            ))
                        )}




                      </PerfectScrollbar>
                    </Grid>
                  </Grid>
                  <Divider />
                  <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Link to={`/all_comments`}>
                    <Button size="small" onClick={handleClose} disableElevation>
                      View All
                    </Button>
                    </Link>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
