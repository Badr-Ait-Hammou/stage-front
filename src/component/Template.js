import React, {useState, useRef, useEffect} from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Toolbar} from 'primereact/toolbar';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import axios from "axios";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {Card, CardContent, Chip, Grid,} from '@mui/material';
import {Box} from "@mui/system";
import {FileUpload} from 'primereact/fileupload';
import "../style/Image.css"
import 'leaflet-draw/dist/leaflet.draw.css'
import {Dropdown} from 'primereact/dropdown';
import {Chips} from "primereact/chips";
import MainCard from "../ui-component/cards/MainCard";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Link} from "react-router-dom";
import PopularCart from "../ui-component/cards/Skeleton/PopularCard";
import FileDownloadIcon from "@mui/icons-material/FileDownload";


export default function Template() {


    const [productDialog, setProductDialog] = useState(false);
    const [resulteditDialog, setResultEditDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [name, setName] = useState('');
    const [file, setFile] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [projet, setProjet] = useState([]);
    const [fields, setFields] = useState([]);
    const [image, setImages] = useState([]);
    const [result, setResult] = useState([]);
    const [fielvalue, setFieldvalue] = useState([]);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);
    const dt = useRef(null);
    const [selectedResult, setSelectedResult] = useState(null);
    const [resultId, setResultId] = useState("");
    const [chipsValue, setChipsValue] = useState([]);
    const [selectedResultId, setSelectedResultId] = useState('');
    const [globalFilter, setGlobalFilter] = useState(null);




    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const projetResponse = await axios.get('http://localhost:8080/api/projet/all');
            setProjet(projetResponse.data);

            const resultResponse = await axios.get('http://localhost:8080/api/result/all');
            setResult(resultResponse.data);
            handleDataTableLoad();

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/field/all").then((response) => {
            setFields(response.data);
        });
    }, []);




    const handleDeleteField = async (fieldId) => {
        try {
            const fieldToDelete = fields.find((field) => field.id === fieldId);

            if (!fieldToDelete) {
                console.error("Field not found:", fieldId);
                return;
            }

            if (fieldToDelete.fieldValueList.length > 0) {
                const inputIdToDelete = fieldToDelete.fieldValueList[0].id;
                await handleDeleteInput(inputIdToDelete);
            }

            const response = await axios.delete(`http://localhost:8080/api/field/${fieldId}`);
            console.log("Field deleted:", fieldId, response);

            await fetchFields();
            fetchFieldvalue();
        } catch (error) {
            console.error("Error while deleting field:", error);
        }
    };

    const handleDeleteInput = async (inputId) => {
        try {
            if (!inputId) {
                console.error("Input ID not provided.");
                return;
            }

            const response = await axios.delete(`http://localhost:8080/api/fieldvalue/${inputId}`);
            console.log("Input deleted:", inputId, response);

            const updatedFields = fields.map((field) => {
                const updatedField = {...field};
                updatedField.fieldValueList = updatedField.fieldValueList.filter((input) => input.id !== inputId);
                return updatedField;
            });
            setFields(updatedFields);

        } catch (error) {
            console.error("Error while deleting input:", error);
        }
    };


    const fetchFieldsByResult = (resultId) => {
        axios.get(`http://localhost:8080/api/field/result/${resultId}`)
            .then((response) => {
                setFields(response.data);
            })
            .catch((error) => {
                console.error("Error while fetching fields:", error);
            });
    };


    const handleSubmit = (event) => {
        event?.preventDefault();
        axios.post("http://localhost:8080/api/result/save", {
            name,
            file,
            description,
            type,
        }).then((response) => {
            console.log(response.data);
            console.log(file);
            setName("");
            setFile("");
            setDescription("");
            setType("");

            hideDialog();
            loadResult();
            fetchData();
            showusave();
        }).catch((error) => {
            console.error("Error while saving file:", error);
        });
    };

    /******************************************** Save  fields ******************************************/


    const handleEdit = async () => {
        try {
            const updatedProject = {
                id: selectedResult.id,
                name,
                file,
                description,

            };
            const response = await axios.put(`http://localhost:8080/api/result/${selectedResult.id}`, updatedProject);

            const updatedProjects = result.map((result) =>
                result.id === response.data.id ? response.data : result
            );

            setResult(updatedProjects);
            hideeditDialog();
            loadResult();
            fetchData();
            showuedit();
        } catch (error) {
            console.error(error);
        }
    };


    /******************************************** Save  fields ******************************************/


    const handleSave = (event) => {
        event.preventDefault();

        if (chipsValue.length === 0 || resultId.length === 0) {
            showMissing();
            return;
        }
        const savePromises = chipsValue.map(chip => {
            return axios.post("http://localhost:8080/api/field/save", {
                name: chip,
                result: {
                    id: resultId
                }
            });
        });

        Promise.all(savePromises)
            .then((responses) => {
                console.log("Saved all chips:", responses);
                setChipsValue([]);
                fetchFields();
            })
            .catch((error) => {
                console.error("Error while saving chips:", error);
            });
    };

    /******************************************** Save inputs with field ***************************************/

    const handleSaveAllInputs = () => {
        const savePromises = fields.map((field) =>
            axios.post("http://localhost:8080/api/fieldvalue/save", {
                value: field.inputValue || "",
                field: {
                    id: field.id,
                },
            })
        );

        Promise.all(savePromises)
            .then((responses) => {
                console.log("Saved all input values:", responses);
                setFields(fields.map((field) => ({ ...field, inputValue: "", saved: true }))); // Set saved to true

                fetchData();
                fetchFieldvalue();
                fetchFields();
            })
            .catch((error) => {
                console.error("Error while saving input values:", error);
            });
    };


    const fetchFields = () => {
        axios.get("http://localhost:8080/api/field/all").then((response) => {
            setFields(response.data);
        });
    };
    const fetchFieldvalue = () => {
        axios.get("http://localhost:8080/api/fieldvalue/").then((response) => {
            setFieldvalue(response.data);
        });
    };

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


    /********************************************Load Result *************************/
    const loadResult = async () => {
        const res = await axios.get(`http://localhost:8080/api/result/all`);
        setImages(res.data);
    }


    /******************************************** Delete Template *********************************************/


    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`http://localhost:8080/api/result/${id}`)
                .then(() => {
                    setResult(result.filter((rowData) => rowData.id !== id));
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


    /******************************************** Dialogues *************************/


    const openNew = () => {
        setSubmitted(false);
        setDescription("");
        setName("");
        setFile("");
        setDescription("");
        setType("");
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };
    const hideeditDialog = () => {
        setSubmitted(false);
        setResultEditDialog(false);
    };


    /***********************Update **************/


    /********************************************Toasts *************************/

    const showusave = () => {
        toast.current.show({severity: 'success', summary: 'success', detail: 'item added successfully', life: 3000});
    }

    const showuedit = () => {
        toast.current.show({severity: 'info', summary: 'Done', detail: 'item updated successfully', life: 3000});
    }

    const showMissing = () => {
        toast.current.show({severity: 'error', summary: 'Error', detail: 'one of the fields is empty', life: 3000});
    }


    /******************************************** components *************************/


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New Template" icon="pi pi-plus" severity="success" onClick={openNew}/>
            </div>
        );
    };


    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog}/>
            <Button label="Create"
                    severity="success"
                    raised onClick={(e) => handleSubmit(e)}/>
        </React.Fragment>
    );
    const resulteditDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideeditDialog}/>
            <Button label="update"
                    severity="success"
                    raised onClick={(e) => handleEdit(e)}/>
        </React.Fragment>
    );

    const handleInputChange = (fieldId, inputValue) => {
        const updatedFields = fields.map((field) => {
            if (field.id === fieldId) {
                return {...field, inputValue};
            }
            return field;
        });
        setFields(updatedFields);
    };


    const handleResultChange = (event) => {
        setResultId(event.value);
    };

    const handleResult2Change = (event) => {
        const newResultId = event.value;
        setSelectedResultId(newResultId);
        fetchFieldsByResult(newResultId);
    };


    const handleupdate = (rowData) => {
        setSelectedResult(rowData);
        setName(rowData.name);
        setDescription(rowData.description);
        setFile(rowData.file);
        setResultEditDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined style={{marginRight:"4px"}} onClick={() => handleupdate(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => handleDelete(rowData.id)} />
            </React.Fragment>
        );
    };
    const resultFileBodyTemplate = (rowData) => {
        if (rowData.file && rowData.file) {
            return (
                <a href={rowData.file} download>
                    <FileDownloadIcon /> Download
                </a>
            );
        }
        return null;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <>
            <Toast ref={toast}/>
            <ConfirmDialog/>
                <div className="card">
                    <Toolbar className="mb-4" center={leftToolbarTemplate}></Toolbar>

                    {dataTableLoaded ? (
                        <DataTable ref={dt} value={result}
                                   dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Templates" globalFilter={globalFilter} header={header}>
                            <Column field="id" header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                            <Column field="name" header="Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '10rem' }}  body={(rowData) => (
                                <Link className="font-bold" to={`project_details/${rowData.id}`}>{rowData.name}</Link>
                            )}></Column>
                            <Column field="description" header="Description" sortable style={{ minWidth: '10em' }}></Column>
                            <Column field="file" header="file" body={resultFileBodyTemplate} sortable style={{ minWidth: '10rem' }} ></Column>
                            <Column  header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                        </DataTable>
                    ) : (
                        <PopularCart/>
                    )}

                    <div className="mt-5">
                    <MainCard title="Manage Fields" >

                    <Grid container spacing={2} className="mt-5">
                        <Grid item xs={12} sm={6}>
                            <Box className="field mt-2 " style={{display: 'flex', justifyContent: 'center'}}>
                                <div className="card p-fluid" style={{width: '100%'}}>
                                    <span className="p-float-label" style={{width: '100%'}}>
                                        <Chips value={chipsValue} onChange={(e) => setChipsValue(e.value)}/>
                                        <label htmlFor="chips">Fields</label>
                                    </span>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box className="field mt-2" style={{display: 'flex', justifyContent: 'center'}}>

                                <Dropdown
                                    id="resultId"
                                    options={result.map((template) => ({label: template.name, value: template.id}))}
                                    value={resultId}
                                    onChange={handleResultChange}
                                    placeholder="Select Template"
                                    style={{width: '100%'}}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} className="mt-1"
                              style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button
                                label="Save"
                                severity="success"
                                raised
                                onClick={handleSave}
                            />
                        </Grid>
                        <Grid item xs={12} className="mt-3"
                              style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        </Grid>


                        <Grid item xs={12}>
                            <Box className="field" style={{display: 'flex', justifyContent: 'center'}}>
                                <Dropdown
                                    id="resultId"
                                    options={result.map((template) => ({label: template.name, value: template.id}))}
                                    value={selectedResultId}
                                    onChange={handleResult2Change}
                                    placeholder="Select Template"
                                    style={{width: '100%'}}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} className="mt-3"
                              style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <strong>Fields</strong>
                        </Grid>

                        <Grid item xs={12} spacing={2} className="mt-3">
                            <Card style={{ backgroundColor: 'rgb(236, 230, 245)' }}>
                                <CardContent>
                                    {fields.length === 0 ? (
                                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                            No fields found.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                                            {fields.map((field, index) => (
                                                <Grid item xs={12} sm={6} key={field.id}>
                                                    <Box className="field">
                                                        <Chip
                                                            label={field.name}
                                                            onDelete={() => handleDeleteField(field.id)}
                                                            color="primary"
                                                            style={{ marginRight: '15px' }}
                                                        />
                                                        {(!field.fieldValueList[0] || !field.fieldValueList[0].value) ? (
                                                            <InputText
                                                                placeholder={field.saved ? "Saved" : "Input"}
                                                                value={field.inputValue || ''}
                                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                            />
                                                        ) : (
                                                            <span>{field.fieldValueList[0].value}</span>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            ))}

                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                                        <Button onClick={handleSaveAllInputs}>Save All</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    </MainCard>
                    </div>

                </div>



            <Dialog visible={productDialog} style={{width: '40rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Create Template" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box className="field">
                            <label htmlFor="name" className="font-bold">
                                Name
                            </label>
                            <InputText style={{marginTop: "5px"}} id="name" value={name}
                                       onChange={(event) => setName(event.target.value)} required autoFocus/>
                            {submitted && !image.name && <small className="p-error">Name is required.</small>}
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
                            emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                            chooseLabel="Select File"
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

            </Dialog>





            <Dialog visible={resulteditDialog} style={{width: '40rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Update Template" modal className="p-fluid" footer={resulteditDialogFooter} onHide={hideeditDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box className="field">
                            <label htmlFor="name" className="font-bold">
                                Name
                            </label>
                            <InputText style={{marginTop: "5px"}} id="name" value={name}
                                       onChange={(event) => setName(event.target.value)} required autoFocus/>
                            {submitted && !image.name && <small className="p-error">Name is required.</small>}
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
                            emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                            chooseLabel="Select File"
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

            </Dialog>


        </>
    );
}
        