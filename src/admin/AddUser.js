import React, {useState,useEffect,useRef} from "react"
import {useTheme} from "@mui/material/styles";
import {
    Box,Switch,
    FormControlLabel,
    FormControl, FormHelperText,
    Grid, IconButton, InputAdornment,
    InputLabel, OutlinedInput,
    TextField,
    Typography,
    useMediaQuery
} from "@mui/material";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import {Formik} from "formik";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useScriptRef from "../hooks/useScriptRef";
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import axios from "axios";
import {Toast} from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';


export default function AddUser(){

    const[firstname,setFirstName]=useState('');
    const[lastname,setLastName]=useState('');
    const[email,setEmail]=useState('');
    const[username,setUserName]=useState('');
    const[tel,settel]=useState('');
    const[password,setpassword]=useState('');
    const[role,setRole]=useState('');
    const [userDialog, setUserDialog] = useState(false);
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const toast = useRef(null);



    const handleSubmit = (event) => {
        event.preventDefault();

        if (username.trim() === '' || firstname.trim() === '' ||lastname.trim() === '' ||email.trim() === '' ||password.trim() === '') {
            toast.current.show({ severity: 'error', summary: 'Successful', detail: 'one of the fields is empty', life: 3000 });
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

            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };



    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button   label="New" icon="pi pi-plus" severity="success" onClick={openDialog} />
            </div>
        );
    };


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const hideDialog = () => {
       // setSubmitted(false);
        setUserDialog(false);
    };
    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button  label="save"
                     severity="success"
                     raised onClick={(e) => handleSubmit(e)}/>
        </React.Fragment>
    );
    const openDialog = () => {
        setUserDialog(true);
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
               <Toast ref={toast} />
               <Toolbar className="mb-4" start={leftToolbarTemplate}  ></Toolbar>



















               <Dialog visible={userDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add User" modal className="p-fluid" footer={userDialogFooter}  onHide={hideDialog}>
               <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email ').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur,handleChange }) => (
                    <form noValidate >
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    margin="normal"
                                    name="fname"
                                    type="text"
                                    defaultValue=""
                                    value={firstname} onChange={(e) => setFirstName(e.target.value)}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    margin="normal"
                                    name="lname"
                                    type="text"
                                    defaultValue=""
                                    value={lastname} onChange={(e) => setLastName(e.target.value)}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="UserName"
                                    margin="normal"
                                    name="lname"
                                    type="text"
                                    defaultValue=""
                                    value={username} onChange={(e) => setUserName(e.target.value)}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    margin="normal"
                                    name="lname"
                                    type="number"
                                    defaultValue=""
                                    value={tel} onChange={(e) => settel(e.target.value)}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                        </Grid>

                        <FormControl fullWidth  sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                //value={values.email}
                                value={email} onChange={(e) =>{setEmail(e.target.value); handleChange(e.target.value);} }
                                name="email"
                                onBlur={handleBlur}
                                inputProps={{}}
                            />

                        </FormControl>



                        <FormControl fullWidth  sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                //value={values.password}
                                value={password} onChange={(e) =>{ setpassword(e.target.value);changePassword(e.target.value);}}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />

                        </FormControl>


                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
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

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <FormControl component="fieldset">
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
                            />
                        </FormControl>


                    </form>
                )}

            </Formik>
               </Dialog>

        </>

    );
};
