import React, {useState,useEffect,useRef} from "react";
import MainCard from "../ui-component/cards/MainCard";
import { Button } from 'primereact/button';
import {Box} from "@mui/system";
import { InputText } from "primereact/inputtext";
import axios from "../utils/axios";
import {Toast} from "primereact/toast";
import {styled} from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Addphoto from "../assets/images/add photo.png";
import {auth} from "../routes/auth";
import {Typography} from "@mui/material";


const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    padding:2,
    border: `2px solid ${theme.palette.background.paper}`,
}));


export default function Profile() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [tel, settel] = useState('');
    const [user,setUser]=useState([]);
    const toast = useRef(null);
    const [id, setId] = useState(parseInt(auth.getTokenInfo().sub));




    useEffect(() => {
        console.log(id);
        axios.get(`/api/users/${id}`).then((response) => {
            setUser(response.data);
            console.log(getInitials());
        });
    }, [id]);


    const getInitials = () => {
        const firstInitial = user.firstName ? user.firstName[0].toUpperCase() : '';
        const lastInitial = user.lastName ? user.lastName[0].toUpperCase() : '';
        return firstInitial + lastInitial;
    };


    const handleUpdate = (event) => {
        event.preventDefault();

        const requestData = {
            id:user.id,
            firstName  :firstName || user.firstName,
            lastName : lastName || user.lastName,
            username : username || user.username,
            email:email,
            tel :tel || user.tel,
            role:user.role,
            password:user.password,
        };

        axios.put(`/api/users/${id}`, requestData)
            .then((response) => {
                console.log("API Response:", response.data);

                loadUser();
                showupdate();
            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };

    /***********************Toasts **************/

    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'info updated successfully', life: 3000});
    }


    const loadUser = async () => {
        axios.get(`/api/users/${id}`).then((response) => {
            setUser(response.data);

            if (!firstName && user) setFirstName(user.firstName);
            if (!lastName && user) setLastName(user.lastName);
            if (!username && user) setUserName(user.username);
            if (!tel && user) settel(user.tel);
            if (!email && user) setEmail(user.email);
        });
    };


    return (
        <MainCard >
            <Toast ref={toast} />


            <Box className="card   md:flex-row ">
                <Box className="card mb-4">
                    <Box className=" text-center">
                        <label htmlFor="uploadImage">
                            <Box style={{ alignItems: "center", justifyContent: 'center', display: "flex",marginBottom:"8px" }}>
                                    <Badge

                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            <SmallAvatar  alt="Remy Sharp" src={Addphoto}  />
                                        }
                                    >

                                        <Avatar
                                            style={{ width: '150px', height: '145px', cursor: 'pointer', alignItems: "center", justifyContent: "center" }}
                                        >
                                            <Typography
                                            variant="h1"
                                            style={{
                                                fontWeight: 'bold',
                                                color: 'white'
                                            }}
                                        >
                                            {getInitials()}
                                        </Typography>
                                        </Avatar>
                                    </Badge>
                            </Box>
                        </label>
                        <strong
                            className="my-3 font-serif mt-5"><i className="mx-2 pi pi-building "></i>
                            { user ? user.username || 'username' : 'username'}
                        </strong>

                        <h3
                            className="text-muted mb-1 mt-3"><i className="mx-2 pi pi-phone  "></i>
                            { user ? user.tel || 'phone' : 'Phone'}
                        </h3>
                        <p
                            className="text-muted mb-4 mt-2">  <i className="mx-2 pi  pi-globe "></i>
                            { user ? user.email || 'Email' : 'Email'}
                        </p>
                        <Box className="card">
                            <div className="d-flex justify-content-center mb-2">

                                        <Button label="Update" severity="info" raised onClick={handleUpdate} />

                            </div>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box className="card flex flex-column md:flex-row gap-3">
                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon" >
                    <i style={{fontSize:"12px"}}>userName</i>
                </span>
                    <InputText placeholder={user ? user.username ||'username' : 'UserName'}
                               value={username}
                               onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i>FirstName</i>
                    </span>
                    <InputText placeholder={ user ? user.firstName ||'firstName' : 'firstName'}
                               value={firstName}
                               onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

            </Box>





            <Box className="card flex flex-column md:flex-row gap-3 mt-2">
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i style={{fontSize:"12px"}}>LastName</i>
                    </span>
                    <InputText placeholder={ user ? user.lastName || 'lastName' : 'lastName'}
                               value={lastName}
                               onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i style={{fontSize:"12px"}} >Phone</i>
                </span>
                    <InputText placeholder={ user ? user.tel || 'phone' : 'PHONE'}
                               value={tel}
                               onChange={(e) => settel(e.target.value)}
                    />
                </div>

            </Box>

        </MainCard>
    );
}
