import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
import {Card, CardContent, Grid,} from '@mui/material';

import MainCard from "../ui-component/cards/MainCard";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {Box} from "@mui/system";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {FileUpload} from "primereact/fileupload";
import {InputTextarea} from "primereact/inputtextarea";
import {Toast} from "primereact/toast";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {useRef} from "react";

export default function TemplateDetails() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [name, setName] = useState('');
    const [file, setFile] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const toast = useRef(null);



    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/result/${id}`)
            .then((response) => {
                setResult(response.data);
                setName(response.data.name);
                setType(response.data.type);
                setDescription(response.data.description);
                setFile(response.data.file); // Adjust the property name based on your API response

            })
            .catch((error) => {
                console.error("Error fetching image details:", error);
            });
    }, [id]);

    const loadResult = async () => {
        const res = await axios.get(`http://localhost:8080/api/result/${id}`);
        setResult(res.data);
    }








    const handleEdit = async () => {
        try {
            const updatedProject = {
                id:id,
                name,
                file,
                description,
                type,

            };
            const response = await axios.put(`http://localhost:8080/api/result/${id}`, updatedProject);

            setResult(response.data);


            showuedit();
            loadResult();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`http://localhost:8080/api/result/${id}`)
                .then(() => {
                    setResult(result.id !== id);
                    toast.current.show({severity:'success', summary: 'Done', detail:'Template deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting project:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'Template Associated with a project or Fields', life: 3000});
                });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Template ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
    };


    const showuedit = () => {
        toast.current.show({severity: 'info', summary: 'Done', detail: 'item updated successfully', life: 3000});
    }


    const handlefileChange = (event) => {
        const files = event.files;

        if (files && files.length > 0) {
            const file = files[0];

            const reader = new FileReader();
            reader.onload = (e) => {
                setFile(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };




    return (
        <>

            <Toast ref={toast}/>
            <ConfirmDialog/>
        <MainCard title={`Template Details -- ${name}`}>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box  style={{width: '40rem'}} header="Create Template"  className="p-fluid" >
                    {result ? (
                        <React.Fragment>
                    <Grid  container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box className="field">
                        <label htmlFor="name" className="font-bold">
                            Name
                        </label>
                        <InputText style={{marginTop: "5px"}} id="name" value={name}
                                   onChange={(event) => setName(event.target.value)} required autoFocus/>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box className="field">
                        <label htmlFor="type" className="font-bold">
                            Type
                        </label>
                        <Dropdown
                            style={{marginTop: "5px"}}
                            id="type"
                            value={type}
                            options={[
                                {label: 'Word', value: 'word'},
                                {label: 'Excel', value: 'excel'}
                            ]}
                            onChange={(event) => setType(event.value)}
                            optionLabel="label"
                            optionValue="value"
                        />
                    </Box>
                </Grid>

            </Grid>


            <Grid item xs={12}>
                <Box className="field mt-2">
                    <label htmlFor="image" className="font-bold">
                        file
                    </label>

                    <FileUpload
                        className="mt-2"
                        name="file"
                        url={'/api/upload'}
                        maxFileSize={100000000}
                        emptyTemplate={
                            file ? (
                                <strong>File : <a href={result.file}> <FileDownloadIcon /> Download</a></strong>
                            ) : (
                                <p className="m-0">Drag and drop files here to upload.</p>
                            )
                        }                        chooseLabel="Select File"
                        uploadLabel="Upload"
                        cancelLabel="Cancel"
                        onSelect={(e) => handlefileChange(e)}
                    />

                </Box>
            </Grid>
            <Box className="field mt-2">
                <label htmlFor="description" className="font-bold">
                    Description
                </label>
                <InputTextarea style={{marginTop: "5px"}} id="description" value={description}
                               onChange={(e) => setDescription(e.target.value)} required rows={3} cols={20}/>
            </Box>

                <Box className="field mt-2" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <Button label="Update"
                            severity="success"
                            raised onClick={(e) => handleEdit(e)} />
                    <Button label="Delete"
                            severity="warning" onClick={() => handleDelete(result.id)} />
                </Box>
                        </React.Fragment>
                    ) : (
                        <Grid item xs={12} spacing={2} className="mt-3">
                            <Card style={{ backgroundColor: 'rgb(236, 230, 245)' }}>
                                <CardContent>
                                    <p>No data available.</p>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Box>
            </div>
        </MainCard>
            </>
    );
}
