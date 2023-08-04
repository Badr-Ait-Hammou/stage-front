import React, {useState, useEffect, useRef} from "react"
import {useTheme} from "@mui/material/styles";
import {
    Box, Switch,
    FormControlLabel,
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
import axios from "axios";
import {Toast} from "primereact/toast";
import {Toolbar} from 'primereact/toolbar';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";


export default function AddUser() {

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [tel, settel] = useState('');
    const [password, setpassword] = useState('');
    const [role, setRole] = useState('');
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


    useEffect(() => {
        axios.get("http://localhost:8080/api/users/").then((response) => {
            setUsers(response.data);
        });
    }, []);

    const loadUsers = async () => {
        const res = await axios.get(`http://localhost:8080/api/users/`);
        setUsers(res.data);
    }


    const handleSubmit = (event) => {
        event.preventDefault();

        if (username.trim() === '' || firstname.trim() === '' || lastname.trim() === '' || email.trim() === '' || password.trim() === '') {
            toast.current.show({
                severity: 'error',
                summary: 'Warning',
                detail: 'one of the fields is empty',
                life: 3000
            })
        }else if(role.trim()==='') {
            toast.current.show({
                severity: 'error',
                summary: 'Warning',
                detail: 'please select a Role',
                life: 3000
            })
            return;
        }

        axios.post("http://localhost:8080/api/auth/register", {
            username,
            firstname,
            lastname,
            email,
            tel,
            password,
            role,

        })
            .then((response) => {
                console.log("API Response:", response.data);
                setEmail("");
                setFirstName("");
                setLastName("");
                setUserName("");
                settel("");
                setpassword("");
                setRole("");
                setUserDialog(false);
                loadUsers();

            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Add" icon="pi pi-plus" severity="success" onClick={openDialog}/>
            </div>
        );
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV}/>;
    };
    const centerToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 font-bold">Manage Users</h4>
        </div>;
    };
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const hideDialog = () => {
        setUserDialog(false);
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
                <Button icon="pi pi-pencil" rounded outlined style={{marginRight: "4px"}}/>
                <Button icon="pi pi-trash" rounded outlined severity="danger"/>
            </React.Fragment>
        );
    };

    const openDialog = () => {
        setEmail("");
        settel("");
        setUserName("");
        setRole("");
        setFirstName("");
        setLastName("");
        setUserDialog(true);

    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."/>
            </span>
        </div>
    );
    useEffect(() => {
        changePassword('123456');
    }, []);


    return (
        <>
            <Toast ref={toast}/>
            <div>
                <Toolbar className="mb-4" start={leftToolbarTemplate} center={centerToolbarTemplate}
                         end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={users}
                           dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                           globalFilter={globalFilter} header={header}>
                    <Column field="id" header="ID" sortable style={{minWidth: '7rem'}}></Column>
                    <Column field="firstName" header="FirstName" filter filterPlaceholder="Search Name ..." sortable
                            style={{minWidth: '10rem'}}></Column>
                    <Column field="lastName" header="LastName" filter filterPlaceholder="Search Name ..." sortable
                            style={{minWidth: '10rem'}}></Column>
                    <Column field="email" header="Email" sortable style={{minWidth: '10em'}}></Column>
                    <Column field="role" header="Role" filter filterPlaceholder="Search Name ..." sortable
                            style={{minWidth: '10rem'}}></Column>
                    <Column field="tel" header="Phone" sortable sortField="dateCreation"
                            style={{minWidth: "10rem"}}></Column>
                    <Column header="Action" body={actionBodyTemplate} exportable={false}
                            style={{minWidth: '12rem'}}></Column>
                </DataTable>
            </div>


            <Dialog visible={userDialog} style={{width: '40rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Add User" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
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
                                        defaultValue=""
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
                                        margin="normal"
                                        type="text"
                                        defaultValue=""
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
                                        margin="normal"
                                        type="text"
                                        defaultValue=""
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
                                        margin="normal"
                                        type="text"
                                        defaultValue=""
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
                                    handleChange(e.target.value);
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



                            <FormControl component="fieldset">
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={role === 'ADMIN'}
                                                onChange={() => setRole('ADMIN')}
                                                value="ADMIN"
                                            />
                                        }
                                        label="Admin"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={role === 'GESTIONNAIRE'}
                                                onChange={() => setRole('GESTIONNAIRE')}
                                                value="GESTIONNAIRE"
                                            />
                                        }
                                        label="Gestionnaire"
                                    /> <FormControlLabel
                                        control={
                                            <Switch
                                                checked={role === 'CLIENT'}
                                                onChange={() => setRole('CLIENT')}
                                                value="CLIENT"
                                            />
                                        }
                                        label="Client"
                                    />
                                </div>
                            </FormControl>


                        </form>

            </Dialog>

        </>

    );
};
