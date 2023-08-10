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
import {Toolbar} from "primereact/toolbar";
export default function TemplateDetails() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [name, setName] = useState('');
    const [file, setFile] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const toast = useRef(null);
    const [fields, setFields] = useState([]);




    const [cards, setCards] = useState([]);

    const addNewCard = () => {
        const newCard = {
            id: Date.now(),
            fname: '',
            fieldid: '',
            ftype: '',
            saved: false
        };
        setCards(prevCards => [...prevCards, newCard]);
    };

    const updateCardInput = (cardId, inputName, inputValue) => {
        setCards(prevCards => prevCards.map(card => {
            if (card.id === cardId) {
                return {
                    ...card,
                    [inputName]: inputValue
                };
            }
            return card;
        }));
    };

    useEffect(() => {
        // Load result and associated fields
        loadResult();
        loadFields();
    }, [id]);

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

    const loadFields = async () => {
        const res = await axios.get(`http://localhost:8080/api/field/result/${id}`);
        setFields(res.data);
    }



    const handleSubmitAll = () => {
        const hasEmptyFields = cards.some(
            (card) => !card.fname || !card.fieldid || !card.ftype
        );

        if (hasEmptyFields) {
            showempty();
            console.log("Cannot save due to empty fields.");
            return;
        }

        const savePromises = cards.map((card) =>
            axios.post("http://localhost:8080/api/field/save", {
                name: card.fname,
                fieldid: card.fieldid,
                type: card.ftype,
                result: {
                    id: id
                },
            })
        );

        Promise.all(savePromises)
            .then((responses) => {
                console.log("Saved all field inputs:", responses);
                loadResult();
                loadFields();
                showsave();
                setCards([]);

            })
            .catch((error) => {
                console.error("Error while saving field inputs:", error);
            });
    };


    const removeCard = (cardId) => {
        setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    };



    const handleDeleteField = (fieldId) => {
        axios.delete(`http://localhost:8080/api/field/${fieldId}`)
            .then(() => {
                loadFields();
            })
            .catch((error) => {
                console.error("Error deleting field:", error);
            });
    };

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
    const showsave = () => {
        toast.current.show({severity: 'success', summary: 'Done', detail: 'item added successfully', life: 3000});
    }
    const showempty = () => {
        toast.current.show({severity: 'error', summary: 'Heads Up', detail: 'one of the input fields is empty', life: 3000});
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
                                            <Dropdown
                                                style={{marginTop: "5px"}}
                                                id="type"
                                                value={type}
                                                options={[
                                                    {label: 'Doc', value: 'doc'},
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

                        <Toolbar className="mb-4 mt-10" start="Fields" end={<Button label="Add New" outlined  onClick={addNewCard} className="p-button-primary" />}></Toolbar>

                        {[...cards, ...fields].map(item => (

                            <Box  key={item.id} className="card flex flex-column md:flex-row gap-3 mt-5" >
                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">
                                        <i >Name</i>
                                    </span>
                                    <InputText
                                        placeholder="Name"
                                        value={item.name}
                                        onChange={(e) => updateCardInput(item.id, 'fname', e.target.value)}
                                    />
                                </div>
                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon"><i>Id</i></span>
                                    <InputText
                                        value={item.fieldid}
                                        onChange={(e) => updateCardInput(item.id, 'fieldid', e.target.value)}
                                        placeholder="Id"
                                    />
                                </div>
                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon"><i>Type</i></span>
                                    <Dropdown
                                        placeholder={item.type || "Type"}
                                        value={item.ftype}
                                        options={[
                                            { label: 'Text', value: 'text' },
                                            { label: 'Number', value: 'number' }
                                        ]}
                                        onChange={(e) => updateCardInput(item.id, 'ftype', e.target.value)}
                                    />

                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-sm"
                                    onClick={() => {
                                        if (item.fieldid.length > 0) {
                                            handleDeleteField(item.id);
                                        } else {
                                            removeCard(item.id);
                                        }
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
                            <Button severity="success" raised label="Create All Fields" onClick={handleSubmitAll} className="p-button-primary"  />

                        </Box>
                    </div>
                </MainCard>


        </>
    );
}
