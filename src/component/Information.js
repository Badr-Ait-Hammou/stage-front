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
import BubbleChartIcon from '@mui/icons-material/BubbleChart';


const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    padding:2,
    border: `2px solid ${theme.palette.background.paper}`,
}));


export default function Information() {

    const [name,setName]=useState("");
    const [address,setAddress]=useState("");
    const [phone,setPhone]=useState("");
    const [fax,setFax]=useState("");
    const [webSite,setWebSite]=useState("");
    const [logo, setLogo] = useState("");
    const [email,setEmail]=useState("");
    const [valRc,setValRc]=useState("");
    const [valPatente,setValPatente]=useState("");
    const [valIf,setvalIf]=useState("");
    const [valCnss,setValcnss]=useState("");
    const [valIce,setValIce]=useState("");
    const [company,setCompany]=useState([]);
    const toast = useRef(null);




    useEffect(() => {
        axios.get(`/api/company/getfirst`).then((response) => {
            const companyData = response.data;
            setCompany(companyData);


            if (!name && companyData) setName(companyData.name);
            if (!address && companyData) setAddress(companyData.address);
            if (!phone && companyData) setPhone(companyData.phone);
            if (!fax && companyData) setFax(companyData.fax);
            if (!webSite && companyData) setWebSite(companyData.webSite);
            if (!logo && companyData) setLogo(companyData.logo);
            if (!email && companyData) setEmail(companyData.email);
            if (!valRc && companyData) setValRc(companyData.valRc);
            if (!valPatente && companyData) setValPatente(companyData.valPatente);
            if (!valCnss && companyData) setValcnss(companyData.valCnss);
            if (!valIf && companyData) setvalIf(companyData.valIf);
            if (!valIce && companyData) setValIce(companyData.valIce);
        });
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();

        if (name.trim() === '' || phone.trim() === '' || valCnss.trim() === '' || address.trim() === '' || valRc.trim() === '' || valPatente.trim() === '' || email.trim() === '') {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
            return;
        }

        const requestData = {
            id:1,
            name,
            address,
            phone,
            fax,
            webSite,
            logo,
            email,
            valRc,
            valPatente,
            valCnss,
            valIf,
            valIce
        };

        axios.post("/api/company/", requestData)
            .then((response) => {
                console.log("API Response:", response.data);

                loadCompany();
                showusave();
            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };


    const handleUpdate = (event) => {
        event.preventDefault();

        const requestData = {
            id:company.id,
            name :name,
            address :address,
            phone :phone,
            fax :fax,
            webSite :webSite,
            logo: logo,
            email :email,
            valRc :valRc,
            valPatente :valPatente,
            valCnss :valCnss,
            valIf :valIf,
            valIce :valIce,
        };

        axios.post("/api/company/", requestData)
            .then((response) => {
                console.log("API Response:", response.data);

                loadCompany();
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
    const showusave = () => {
        toast.current.show({severity:'success', summary: 'success', detail:'item added successfully', life: 3000});
    }



    const loadCompany = async () => {
        axios.get(`/api/company/getfirst`).then((response) => {
            const companyData = response.data;
            setCompany(companyData);


            if (!name && companyData) setName(companyData.name);
            if (!address && companyData) setAddress(companyData.address);
            if (!phone && companyData) setPhone(companyData.phone);
            if (!fax && companyData) setFax(companyData.fax);
            if (!webSite && companyData) setWebSite(companyData.webSite);
            if (!logo && companyData) setLogo(companyData.logo);
            if (!email && companyData) setEmail(companyData.email);
            if (!valRc && companyData) setValRc(companyData.valRc);
            if (!valPatente && companyData) setValPatente(companyData.valPatente);
            if (!valCnss && companyData) setValcnss(companyData.valCnss);
            if (!valIf && companyData) setvalIf(companyData.valIf);
            if (!valIce && companyData) setValIce(companyData.valIce);
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogo(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
            <MainCard title={<div style={{display:"flex",justifyContent:"center", alignItems:"center"}}> <BubbleChartIcon /> {company.name.toUpperCase()} COMPANY PROFILE </div>} >

            <Toast ref={toast} />


            <Box className="card   md:flex-row ">
                <Box className="card mb-4">
                    <Box className=" text-center">
                        <label htmlFor="uploadImage">
                            <Box style={{ alignItems: "center", justifyContent: 'center', display: "flex",marginBottom:"8px" }}>
                                {company && company.logo ? (
                                    <Badge

                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            <SmallAvatar  alt="Remy Sharp" src={Addphoto}  />
                                        }
                                    >
                                        <Avatar alt="AH" src={company.logo} style={{ width: '150px',height:'145px', cursor: 'pointer',padding:"30px",alignItems:"center",justifyContent:"center" }}  />
                                    </Badge>
                                ) : (
                                    <div>No logo available</div>
                                )}
                            </Box>
                        </label>
                        <input type="file" id="uploadImage" style={{ display: 'none' }} onChange={handleImageUpload} />
                            <strong
                                className="my-3 font-serif mt-5"><i className="mx-2 pi pi-building "></i>
                                { company ? company.name || 'name' : 'Name'}
                            </strong>

                        <h3
                            className="text-muted mb-1 mt-3"><i className="mx-2 pi pi-phone  "></i>
                            { company ? company.phone || 'phone' : 'Phone'}
                        </h3>
                        <p
                            className="text-muted mb-4 mt-2">  <i className="mx-2 pi  pi-globe "></i>
                            { company ? company.webSite || 'website' : 'WEBSITE'}
                        </p>
                        <Box className="card">
                            <div className="d-flex justify-content-center mb-2">
                                {company && company.id ? (
                                    <>
                                        <Button label="Update" severity="info" raised onClick={handleUpdate} />
                                    </>
                                ) : (
                                    <Button label="Save" severity="success" raised onClick={handleSubmit} />
                                )}
                            </div>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box className="card flex flex-column md:flex-row gap-3">
                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon" >
                    <i style={{fontSize:"12px"}}>Name</i>
                </span>
                    <InputText placeholder={company ? company.name ||'name' : 'NAME'}
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i>Address</i>
                    </span>
                    <InputText placeholder={ company ? company.address ||'address' : 'ADDRESS'}
                               value={address}
                               onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

            </Box>





            <Box className="card flex flex-column md:flex-row gap-3 mt-2">
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i style={{fontSize:"12px"}}>WebSite</i>
                    </span>
                    <InputText placeholder={ company ? company.webSite || 'website' : 'WEBSITE'}
                               value={webSite}
                               onChange={(e) => setWebSite(e.target.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i style={{fontSize:"12px"}} >Phone</i>
                </span>
                    <InputText placeholder={ company ? company.phone || 'phone' : 'PHONE'}
                               value={phone}
                               onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

            </Box>





            <Box className="card flex flex-column md:flex-row gap-3 mt-2">
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i >Fax</i>
                    </span>
                    <InputText placeholder={ company ? company.fax || 'fax' : 'FAX'}
                               value={fax}
                               onChange={(e) => setFax(e.target.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i >Email</i>

                    </span>
                    <InputText placeholder={ company ? company.email || 'email' : 'Email'}
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                    />
                </div>


            </Box>


            <Box className="card flex flex-column md:flex-row gap-3 mt-2">
                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i >I.F</i>
                </span>
                    <InputText placeholder={ company ? company.valIf || 'if' : 'I.F'}
                               value={valIf }
                               onChange={(e) => setvalIf(e.target.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i >Cnss</i>
                    </span>
                    <InputText placeholder={company ? company.valCnss || 'val cnss': 'CNSS'}
                               value={valCnss}
                               onChange={(e) => setValcnss(e.target.value)}
                    />
                </div>

            </Box>


            <Box className="card flex flex-column md:flex-row gap-3 mt-2">
                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i >R.C</i>
                </span>
                    <InputText placeholder={company ? company.valRc || 'valRc': 'R.C'}
                               value={valRc}
                               onChange={(e) => setValRc(e.target.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i style={{fontSize:"16px"}}>I.C.E</i>
                    </span>
                    <InputText placeholder={company ? company.valIce || 'valIce' : 'I.C.E'}
                               value={valIce}
                               onChange={(e) => setValIce(e.target.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i >Patente</i>
                    </span>
                    <InputText placeholder={ company ? company.valPatente || 'patente' : 'PATENTE'}
                               value={valPatente}
                               onChange={(e) => setValPatente(e.target.value)}
                    />
                </div>
            </Box>



        </MainCard>
    );
}
