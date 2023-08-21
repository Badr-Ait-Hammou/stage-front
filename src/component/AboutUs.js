import React, {useState,useEffect} from "react";
import MainCard from "../ui-component/cards/MainCard";
import {Box} from "@mui/system";
import axios from "../utils/axios";
import {styled} from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Addphoto from "../assets/images/add photo.png";
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import {TextField} from "@mui/material";


const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    padding:2,
    border: `2px solid ${theme.palette.background.paper}`,
}));


export default function AboutUs() {

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






    return (
        <MainCard title={<div style={{display:"flex",justifyContent:"center", alignItems:"center"}}> <BubbleChartIcon /> {company.name} COMPANY PROFILE </div>} >
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
                    </Box>
                </Box>
            </Box>

            <Box className="card flex flex-column md:flex-row gap-3 mt-7">
                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `NAME : ${company.name || 'NAME'}`: 'NAME'}
                        fullWidth
                        disabled={true}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `ADDRESS : ${company.address || 'ADDRESS'}`: 'ADDRESS'}
                        fullWidth
                        disabled={true}

                    />
                </div>

            </Box>





            <Box className="card flex flex-column md:flex-row gap-3 mt-5">
                <div className="p-inputgroup flex-1">

                    <TextField
                        label={company ? `WEBSITE : ${company.webSite || 'WEBSITE'}`: 'WEBSITE'}
                        fullWidth
                        disabled={true}

                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `PHONE : ${company.phone || 'PHONE'}`: 'PHONE'}
                        fullWidth
                        disabled={true}

                    />
                </div>

            </Box>





            <Box className="card flex flex-column md:flex-row gap-3 mt-5">
                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `FAX : ${company.fax || 'FAX'}`: 'FAX'}
                        fullWidth
                        disabled={true}

                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `Email : ${company.email || 'Email'}`: 'Email'}
                        fullWidth
                        disabled={true}

                    />
                </div>

            </Box>


            <Box className="card flex flex-column md:flex-row gap-3 mt-5">
                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `I.F : ${company.valIf || 'I.F'}`: 'I.F'}
                        disabled={true}
                        fullWidth
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `CNSS : ${company.valCnss || 'CNSS'}`: 'CNSS'}
                        disabled={true}
                        fullWidth
                    />
                </div>

            </Box>


            <Box className="card flex flex-column md:flex-row gap-3 mt-5">
                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `R.C : ${company.valRc || 'valRc'}`: 'R.C'}
                        disabled={true}
                        fullWidth
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <TextField
                        label={company ? `I.C.E : ${company.valIce || 'valIce'}`: 'I.C.E'}
                        disabled={true}
                        fullWidth
                    />
                </div>

                <div className="p-inputgroup flex-1">

                    <TextField
                        label= {company ? `PATENTE : ${company.valPatente || 'patente'}` : 'PATENTE'}
                        fullWidth
                        disabled={true}

                    />
                </div>
            </Box>



        </MainCard>
    );
}
