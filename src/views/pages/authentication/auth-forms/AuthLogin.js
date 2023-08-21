import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Toast } from 'primereact/toast';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthService from '../../../../routes/AuthService';
import { useNavigate } from 'react-router-dom';



// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef(null);
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      console.error("Email and password are required.");
      fieldrequired();
      return;
    }

    try {
      const user = await AuthService.login(email, password);
      if (user === "CLIENT") {
        navigate('/client/client_projects');
        window.location.reload();
      } else {
        navigate('/visumine/projects');
        window.location.reload();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      showerror();
    }
  };


  const showerror = () => {
    toast.current.show({severity:'error', summary: 'Warning!', detail:'Email or Password are uncorrect', life: 3000});
  }

  const fieldrequired = () => {
    toast.current.show({severity:'error', summary: 'Warning!', detail:'Email and password are required.', life: 3000});
  }

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <>
      <Toast ref={toast} />
      <Formik
        initialValues={{
          email: 'info@codedthemes.com',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
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

        {({ errors, handleBlur, isSubmitting, touched }) => (
          <form noValidate  {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                name="email"
                onBlur={handleBlur}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                name="password"
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
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Box sx={{ mt: 5 ,display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'}}>
              <AnimateButton>
                <Button disabled={isSubmitting} variant="outlined" disableElevation color="secondary" onClick={handleSubmit}  >
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
