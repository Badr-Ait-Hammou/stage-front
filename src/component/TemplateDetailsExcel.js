import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { Button } from "primereact/button";
import {Card, CardContent, Grid,} from '@mui/material';

import MainCard from "../ui-component/cards/MainCard";
import {Box} from "@mui/system";
import {InputText} from "primereact/inputtext";
import {FileUpload} from "primereact/fileupload";
import {InputTextarea} from "primereact/inputtextarea";
import {Toast} from "primereact/toast";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {useRef} from "react";
import Csv from "../assets/images/csv.png"
export default function TemplateDetails() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [name, setName] = useState('');
    const [file, setFile] = useState('');
    const [updfile, setupdFile] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const toast = useRef(null);
    const [fields, setFields] = useState([]);
    const fileUploadRef = useRef(null);




    useEffect(() => {

        loadResult();
        loadFields();
    }, [id]);

    useEffect(() => {
        axios
            .get(`/api/result/${id}`)
            .then((response) => {
                setResult(response.data);
                setName(response.data.name);
                setType(response.data.type);
                setDescription(response.data.description);
                setFile(response.data.file);
            })
            .catch((error) => {
                console.error("Error fetching image details:", error);
            });
    }, [id]);


    const loadResult = async () => {
        const res = await axios.get(`/api/result/${id}`);
        setResult(res.data);
    }

    const loadFields = async () => {
        const res = await axios.get(`/api/field/result/${id}`);
        setFields(res.data);
    }



    const handleDeleteField = (fieldId) => {
        axios.delete(`/api/field/${fieldId}`)
            .then(() => {
                loadFields();
            })
            .catch((error) => {
                console.error("Error deleting field:", error);
            });
    };

    const handleEdit = async () => {
        try {
            if (name.trim() === '' || description.trim() === '' || type.trim() === '' || !file) {
                showempty();
            }else {
                const updatedProject = {
                    id: id,
                    name,
                    description,
                    type,
                    file:updfile,
                };

                const response = await axios.put(`/api/result/${id}`, updatedProject);
                setResult(response.data);
                console.log("upfile",updfile);
                showuedit();
                setupdFile("");
                loadResult();
            }
        } catch (error) {
            console.error(error);
        }
    };

    /************************************************   delete template with all the  fields **********************************/


    const handleDelete = (id) => {
        const confirmDelete = async () => {
            try {

                await Promise.all(fields.map((field) => axios.delete(`/api/field/${field.id}`)));


                await axios.delete(`/api/result/${id}`);


                setFields([]);

                setResult(null);

                toast.current.show({severity:'success', summary: 'Done', detail:'Template deleted successfully', life: 3000});
            } catch (error) {
                console.error('Error deleting template and fields:', error);
                toast.current.show({severity:'error', summary: 'Error', detail:'Error deleting template and fields', life: 3000});
            }
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
    const showempty = () => {
        toast.current.show({severity: 'error', summary: 'Heads Up', detail: 'one of the input fields is empty', life: 3000});
    }

    const showNewFileU = () => {
        toast.current.show({severity: 'success', summary: 'Done', detail: 'New Csv File Uploaded ', life: 3000});
    }


    /************************************************  Upload new file / delete all  the old fields "using Promise" and create the new files fields**********************************/

    const handlefileChange = async (event) => {
        const files = event.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileContent = e.target.result;
                setFile(fileContent);
                setupdFile(`data:text/csv;charset=utf-8,${encodeURIComponent(fileContent)}`);

                console.log("FileReader Output:", fileContent);

                const lines = fileContent.split("\n");
                const firstRow = lines[0].split(",");
                console.log("First Row Attributes:", firstRow);

                const nonEmptyAttributes = firstRow.filter(
                    (attribute) => attribute.trim() !== "" && attribute.trim() !== "\"\""
                );
                console.log("Non-Empty Attributes:", nonEmptyAttributes);

                try {

                    await Promise.all(fields.map((field) => axios.delete(`/api/field/${field.id}`)))
                        .then(() => {
                            console.log("Old fields deleted successfully.");
                        })
                        .catch((error) => {
                            console.error("Error deleting old fields:", error);
                        });

                    if (result) {

                        const updatedResult = {
                            ...result,
                            file: fileContent,
                        };
                        await axios.put(`/api/result/${id}`, updatedResult);
                        setResult(updatedResult);
                    } else {

                        const newResult = {
                            id: id,
                            name: name,
                            file: fileContent,
                            description: description,
                            type: "excel",
                        };
                        const resultResponse = await axios.post("/api/result/save", newResult);
                        setResult(resultResponse.data);
                    }


                    const resultId = result ? result.id : id;
                    for (const attribute of nonEmptyAttributes) {
                        const trimmedAttribute = attribute.trim();
                        const fieldToSave = {
                            namef: trimmedAttribute.replace(/"/g, ""),
                            fieldid: trimmedAttribute.replace(/"/g, "").toUpperCase(),
                            type: "text",
                            result: { id: resultId },
                        };
                        await axios.post("/api/field/save", fieldToSave);
                    }

                    showNewFileU();
                    loadResult();
                    loadFields();

                    console.log("New fields and result saved successfully!");
                } catch (error) {
                    console.error("Error while updating result and saving new fields:", error);
                }
            };
            reader.readAsText(file);
        }
    };





    return (
        <>

            <Toast ref={toast}/>
            <ConfirmDialog/>
            <MainCard title={`Csv Template Details -- ${name}`}>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,backgroundColor:"rgba(238,238,250,0.41)" ,borderRadius:"20px"}} className="mb-10" >
                    <Box  style={{width: '45rem'}} header="Create Template"  className="p-fluid mt-3" >
                        {result ? (
                            <React.Fragment>
                                <Grid  container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Box className="field">
                                            <label htmlFor="name" className="font-bold">
                                                Name
                                            </label>
                                            <InputText style={{marginTop: "5px"}} id="name" value={name}
                                                       onChange={(event) => setName(event.target.value)}
                                                       required autoFocus/>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box className="field">
                                            <label htmlFor="type" className="font-bold">
                                                Type
                                            </label>
                                            <InputText
                                                readOnly={true}
                                                style={{marginTop: "5px"}}
                                                id="type"
                                                value={type}
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
                                            accept={type === 'excel' ? '.csv,.xlsx' : ''}
                                            maxFileSize={100000000}
                                            emptyTemplate={
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                                                    {file ? (
                                                    <strong > <a href={result.file}> <img src={Csv} alt="NoFile" style={{ width: '40px', height: 'auto'}} /> </a></strong>
                                                ) : (
                                                    <p className="m-0">Drag and drop files here to upload.</p>
                                                )}
                                                </div>
                                            }
                                            chooseLabel="Select File"
                                            uploadLabel="Upload"
                                            cancelLabel="Cancel"
                                            ref={fileUploadRef}
                                            onSelect={(e) => {
                                                    const selectedFileType = e.files[0].type;
                                                    const allowedFileTypes = ['application/vnd.ms-excel', 'text/csv'];

                                                    if (!allowedFileTypes.includes(selectedFileType)) {
                                                        toast.current.show({
                                                            severity: 'error',
                                                            summary: 'Info',
                                                            detail: 'Selected file is not compatible with the chosen type.',
                                                            life: 3000
                                                        });
                                                        setFile('');
                                                        fileUploadRef.current.clear();

                                                    }else{
                                                        handlefileChange(e);

                                                    }

                                            }}
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



                            </React.Fragment>
                        ) : (
                            <Grid item xs={12} spacing={2} className="mb-3">
                                <Card style={{ backgroundColor: 'rgb(236, 230, 245)' }}>
                                    <CardContent>
                                        <strong>this Template has been deleted .</strong>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Box>
                </div>


                <div className="mt-10" >


                    {fields.map(item => (

                        <Box  key={item.id} className="card flex flex-column md:flex-row gap-3 mt-5" >
                            <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">
                                        <i >Name</i>
                                    </span>
                                <InputText
                                    placeholder="Name"
                                    value={item.namef}
                                    onChange={(e) => updateCardInput(item.id, 'fname', e.target.value)}
                                    readOnly={true}
                                />
                            </div>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon"><i>Id</i></span>
                                <InputText
                                    value={item.fieldid}
                                    onChange={(e) => updateCardInput(item.id, 'fieldid', e.target.value)}
                                    placeholder="Id"
                                    readOnly={true}
                                />
                            </div>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon"><i>Type</i></span>
                                <InputText
                                    value={item.ftype}
                                    onChange={(e) => updateCardInput(item.id, 'ftype', e.target.value)}
                                    placeholder={item.type || "Type"}
                                    readOnly={true}
                                />


                            </div>
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger p-button-sm"
                                onClick={() => {
                                        handleDeleteField(item.id);

                                }}
                            />


                        </Box>
                    ))}


                    <Box className="field mt-7 mb-5" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <Button label="Update"
                                severity="success"
                                outlined
                                style={{ flex: 1, maxWidth: '150px' }}
                                onClick={(e) => handleEdit(e)} />
                        <Button label="Delete"
                                severity="danger"
                                outlined
                                style={{ flex: 1, maxWidth: '150px' }}
                                onClick={() => handleDelete(result.id)} />

                    </Box>
                </div>
            </MainCard>


        </>
    );
}
