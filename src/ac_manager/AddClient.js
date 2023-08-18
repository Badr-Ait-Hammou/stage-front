
import React, {useState, useEffect, useRef} from "react"
import {styled, useTheme} from "@mui/material/styles";
import {
    Box,
    FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel, OutlinedInput,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {strengthColor, strengthIndicator} from 'utils/password-strength';
import axios from "../utils/axios";
import {Toast} from "primereact/toast";
import {Toolbar} from 'primereact/toolbar';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import Tooltip, {tooltipClasses} from "@mui/material/Tooltip";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";


export default function AddClient() {

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [tel, settel] = useState('');
    const [password, setpassword] = useState('');
    const [users, setUsers] = useState([]);
    const [userDialog, setUserDialog] = useState(false);
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [level, setLevel] = useState();
    const toast = useRef(null);
    const dt = useRef(null);
    const [passwordVisibility, setPasswordVisibility] = useState({});
    const [userEditDialog, setUserEditDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);





    useEffect(() => {
        axios.get("/api/users/role/CLIENT").then((response) => {
            setUsers(response.data);
        });
    }, []);

    const loadClients = async () => {
        const res = await axios.get(`/api/users/role/CLIENT`);
        setUsers(res.data);
    }



    /*************************************************** Generate pwd *************************************************/

    const generateRandomPassword = () => {

        const passwordLength = 12;
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!£-§/;,?°é"².@#$%^&*()_+';
        let password = '';

        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }

        return password;
    };
    const handleGeneratePassword = () => {
        const generatedPassword = generateRandomPassword();
        setpassword(generatedPassword);
        const temp = strengthIndicator(generatedPassword);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const handleTogglePasswordVisibility = (rowData) => {
        setPasswordVisibility((prevState) => ({
            ...prevState,
            [rowData.id]: !prevState[rowData.id]
        }));
    };

    /*************************************************** Save *************************************************/


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            if (username.trim() === '' || firstname.trim() === '' || lastname.trim() === '' || email.trim() === '') {
                toast.current.show({
                    severity: 'error',
                    summary: 'Warning',
                    detail: 'one of the fields is empty',
                    life: 3000
                })
            } else if (!isValidPhoneNumber(tel)) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Invalid Phone Number',
                    detail: 'Please enter a valid phone number (8 to 15 digits)',
                    life: 3000
                });
            } else if (!isValidEmail(email)) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Invalid Email',
                    detail: 'Please enter a valid email address',
                    life: 3000
                });
            } else if (!isValidPassword(password)) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Password Not Strong Enough',
                    detail: 'Please generate a stronger password.',
                    life: 3000
                });
            } else {

                const response = await axios.post("/api/auth/register", {
                    username,
                    firstname,
                    lastname,
                    email,
                    tel,
                    password,
                    role:"CLIENT",

                });

                console.log("API Response:", response.data);
                setEmail("");
                setFirstName("");
                setLastName("");
                setUserName("");
                settel("");
                setpassword("");
                setUserDialog(false);
                loadClients();
                showusave();

            }

        } catch (error) {
            console.error("Error while saving project:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Email Already Used',
                detail: 'The email address is already registered.',
                life: 3000
            });
        }
    };

    /*************************************************** Tooltip *************************************************/


    const ArrowTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.common.black,
            zIndex: 1500,

        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.black,
            zIndex: 1500,

        },
    }));

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Add" icon="pi pi-plus" severity="success" onClick={openDialog}/>
            </div>
        );
    };

    /************************************ Delete ***************************************/


    const deleteUser = (id) => {
        const confirmDelete = async () => {
            try {
                const response = await axios.delete(`/api/users/${id}`);
                console.log("API Response:", response.data);
                loadUsers();
                showudelete();
            } catch (error) {
                console.error("Error while deleting user:", error);
                toast.current.show({severity:'error', summary: 'Error', detail:'user has a project', life: 3000});

            }
        };

        confirmDialog({
            message: 'Are you sure you want to delete this User?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
    };




    /************************************ Dialog open/close *****************************/

    const openDialog = () => {
        setEmail("");
        settel("");
        setUserName("");
        setFirstName("");
        setLastName("");
        setUserDialog(true);
    };
    const hideDialog = () => {
        setUserDialog(false);
        setUserEditDialog(false);

    };

    const handleupdate = (rowData) => {
        setSelectedUser(rowData);
        setFirstName(rowData.firstName);
        setLastName(rowData.lastName);
        setEmail(rowData.email);
        setUserName(rowData.username);
        settel(rowData.tel);
        setUserEditDialog(true);
    };

    /************************************ password check  *****************************/


    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    useEffect(() => {
        changePassword('123456');
    }, []);

    /************************************ Toolbar table component *****************************/


    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV}/>;
    };
    const centerToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 font-bold">Manage Clients</h4>
        </div>;
    };


    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog}/>
            <Button label="save"
                    severity="success"
                    raised onClick={(e) => handleSubmit(e)}/>
        </React.Fragment>
    );
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined style={{marginRight: "4px"}} onClick={() => handleupdate(rowData)}/>
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteUser(rowData.id)}/>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."/>
            </span>
        </div>
    );

    const passwordBodyTemplate = (rowData) => {
        const isPasswordVisible = passwordVisibility[rowData.id];

        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ marginRight: "4px" }}>
                        {isPasswordVisible ? rowData.password : "********"}
                    </span>
                <Tooltip title="Click here to show password" enterDelay={50} leaveDelay={20}>
                    <span style={{ cursor: "pointer" }}
                          onClick={() => handleTogglePasswordVisibility(rowData)}>
                        {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                    </span>
                </Tooltip>
            </div>
        );
    };


    const handleEdit = async () => {
        try {
            const updatedUser = {
                id: selectedUser.id,
                username,
                firstName:firstname,
                lastName:lastname,
                tel,
                password,
                role:"CLIENT",
            };



            const response = await axios.put(`/api/users/${selectedUser.id}`, updatedUser);

            const updatedUsers = users.map((user) =>
                user.id === response.data.id ? response.data : user
            );

            setUsers(updatedUsers);
            setUserEditDialog(false);
            loadClients();
            showupdate();
        } catch (error) {
            console.error(error);
        }
    };





    /********************************************** Regex ***********************************************/

    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const isValidPassword = (password) => {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>?/]+/.test(password);

        return (
            password.length >= minLength &&
            hasUppercase &&
            hasLowercase &&
            hasDigit &&
            hasSpecialChar
        );
    };

    const isValidPhoneNumber = (phoneNumber) => {
        const phoneNumberPattern = /^\d{8,15}$/;
        return phoneNumberPattern.test(phoneNumber);
    };


    const userEditDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog}/>
            <Button label="Update"
                    severity="info"
                    raised onClick={() => handleEdit(selectedUser)}/>
        </React.Fragment>
    );

    /********************************************Toasts *************************/

    const showusave = () => {
        toast.current.show({severity:'success', summary: 'done', detail:'User added successfully', life: 3000});
    }
    const showudelete = () => {
        toast.current.show({severity:'error', summary: 'done', detail:'User deleted successfully', life: 3000});
    }
    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'done', detail:'User updated successfully', life: 3000});
    }

    return (
        <>
            <ConfirmDialog />
            <Toast ref={toast}/>
            <div>
                <Toolbar className="mb-4" start={leftToolbarTemplate} center={centerToolbarTemplate}
                         end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={users}
                           dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Clients"
                           globalFilter={globalFilter} header={header}>
                    <Column field="id" header="ID" sortable style={{minWidth: '7rem'}}></Column>
                    <Column field="firstName" header="FirstName" filter filterPlaceholder="Search FirstName ..." sortable style={{minWidth: '10rem'}}></Column>
                    <Column field="lastName" header="LastName" filter filterPlaceholder="Search LastName ..." sortable style={{minWidth: '10rem'}}></Column>
                    <Column field="email" header="Email" sortable style={{minWidth: '10em'}}></Column>
                    <Column field="username" header="UserName" sortable style={{minWidth: '10em'}}></Column>
                    <Column field="tel" header="Phone" sortable sortField="dateCreation" style={{minWidth: "10rem"}}></Column>
                    <Column field="password" header="Password" filter filterPlaceholder="Search password ..." style={{minWidth: '10rem'}} sortable  body={passwordBodyTemplate}></Column>

                    <Column header="Action" body={actionBodyTemplate} exportable={false} style={{minWidth: '12rem'}}></Column>
                </DataTable>
            </div>


            <Dialog visible={userDialog} style={{width: '40rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Add Client" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                <form noValidate>
                    <Grid container  spacing={matchDownSM ? 0 : 1}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{...theme.typography.customInput,mt:1}}>
                                <InputLabel >
                                    FirstName
                                </InputLabel>
                                <OutlinedInput
                                    style={{padding:"5px"}}
                                    type="text"

                                    value={firstname} onChange={(e) => setFirstName(e.target.value)}
                                    sx={{...theme.typography.customInput}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{...theme.typography.customInput,mt:1}}>
                                <InputLabel htmlFor="outlined-adornment-email-register" >LastName
                                </InputLabel>
                                <OutlinedInput
                                    style={{padding:"5px"}}
                                    margin="none"
                                    type="text"

                                    value={lastname} onChange={(e) => setLastName(e.target.value)}
                                    sx={{...theme.typography.customInput}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{...theme.typography.customInput,mt:-1}}>
                                <InputLabel htmlFor="outlined-adornment-email-register" >Username
                                </InputLabel>
                                <OutlinedInput
                                    style={{padding:"5px"}}
                                    margin="none"
                                    type="text"

                                    value={username} onChange={(e) => setUserName(e.target.value)}
                                    sx={{...theme.typography.customInput}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{...theme.typography.customInput,mt:-1}}>
                                <InputLabel htmlFor="outlined-adornment-email-register" >Phone
                                </InputLabel>
                                <OutlinedInput
                                    style={{padding:"5px"}}
                                    margin="none"
                                    type="text"

                                    value={tel} onChange={(e) => settel(e.target.value)}
                                    sx={{...theme.typography.customInput}}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <FormControl fullWidth sx={{...theme.typography.customInput,mt:1}}>
                        <InputLabel htmlFor="outlined-adornment-email-register" >Email Address
                        </InputLabel>
                        <OutlinedInput
                            style={{padding:"10px"}}
                            id="outlined-adornment-email-register"
                            type="email"
                            value={email} onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                            name="email"

                        />

                    </FormControl>


                    <FormControl fullWidth sx={{...theme.typography.customInput}}>
                        <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password-register"
                            type={showPassword ? 'text' : 'password'}
                            style={{padding:"10px"}}
                            value={password} onChange={(e) => {
                            setpassword(e.target.value);
                            changePassword(e.target.value);
                        }}
                            name="password"
                            label="Password"
                            endAdornment={
                                <InputAdornment position="end">


                                    <IconButton
                                        aria-label="toggle password generator"
                                        onClick={handleGeneratePassword}
                                        edge="end"
                                        size="medium"
                                    >
                                        <ArrowTooltip title="Click here to Generate password" placement="bottom">
                                            <SyncLockIcon />
                                        </ArrowTooltip>

                                    </IconButton>

                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        size="large"
                                    >
                                        {showPassword ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>


                                </InputAdornment>
                            }
                        />

                    </FormControl>


                    {strength !== 0 && (
                        <FormControl fullWidth>
                            <Box sx={{mb: 2}}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Box style={{backgroundColor: level?.color}}
                                             sx={{width: 85, height: 8, borderRadius: '7px'}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" fontSize="0.75rem">
                                            {level?.label}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </FormControl>
                    )}

                </form>
            </Dialog>


            <Dialog visible={userEditDialog} style={{width: '40rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Add Client" modal className="p-fluid" footer={userEditDialogFooter} onHide={hideDialog}>
                <form noValidate>
                    <Grid container  spacing={matchDownSM ? 0 : 1}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{...theme.typography.customInput,mt:1}}>
                                <InputLabel >
                                    FirstName
                                </InputLabel>
                                <OutlinedInput
                                    style={{padding:"5px"}}
                                    type="text"

                                    value={firstname} onChange={(e) => setFirstName(e.target.value)}
                                    sx={{...theme.typography.customInput}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{...theme.typography.customInput,mt:1}}>
                                <InputLabel htmlFor="outlined-adornment-email-register" >LastName
                                </InputLabel>
                                <OutlinedInput
                                    style={{padding:"5px"}}
                                    margin="none"
                                    type="text"

                                    value={lastname} onChange={(e) => setLastName(e.target.value)}
                                    sx={{...theme.typography.customInput}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{...theme.typography.customInput,mt:-1}}>
                                <InputLabel htmlFor="outlined-adornment-email-register" >Username
                                </InputLabel>
                                <OutlinedInput
                                    style={{padding:"5px"}}
                                    margin="none"
                                    type="text"

                                    value={username} onChange={(e) => setUserName(e.target.value)}
                                    sx={{...theme.typography.customInput}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{...theme.typography.customInput,mt:-1}}>
                                <InputLabel htmlFor="outlined-adornment-email-register" >Phone
                                </InputLabel>
                                <OutlinedInput
                                    style={{padding:"5px"}}
                                    margin="none"
                                    type="text"

                                    value={tel} onChange={(e) => settel(e.target.value)}
                                    sx={{...theme.typography.customInput}}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <FormControl fullWidth sx={{...theme.typography.customInput,mt:1}}>
                        <InputLabel htmlFor="outlined-adornment-email-register" >Email Address
                        </InputLabel>
                        <OutlinedInput
                            style={{padding:"10px"}}
                            id="outlined-adornment-email-register"
                            type="email"
                            disabled={true}
                            value={email} onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                            name="email"

                        />

                    </FormControl>


                    <FormControl fullWidth sx={{...theme.typography.customInput}}>
                        <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password-register"
                            type={showPassword ? 'text' : 'password'}
                            style={{padding:"10px"}}
                            value={password} onChange={(e) => {
                            setpassword(e.target.value);
                            changePassword(e.target.value);
                        }}
                            name="password"
                            label="Password"
                            endAdornment={
                                <InputAdornment position="end">


                                    <IconButton
                                        aria-label="toggle password generator"
                                        onClick={handleGeneratePassword}
                                        edge="end"
                                        size="medium"
                                    >
                                        <ArrowTooltip title="Click here to Generate password" placement="bottom">
                                            <SyncLockIcon />
                                        </ArrowTooltip>

                                    </IconButton>

                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        size="large"
                                    >
                                        {showPassword ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>


                                </InputAdornment>
                            }
                        />

                    </FormControl>


                    {strength !== 0 && (
                        <FormControl fullWidth>
                            <Box sx={{mb: 2}}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Box style={{backgroundColor: level?.color}}
                                             sx={{width: 85, height: 8, borderRadius: '7px'}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" fontSize="0.75rem">
                                            {level?.label}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </FormControl>
                    )}
                </form>

            </Dialog>




        </>

    );
};
