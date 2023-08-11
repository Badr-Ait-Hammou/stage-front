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
import { Grid,} from '@mui/material';
import {Box} from "@mui/system";
import {FileUpload} from 'primereact/fileupload';
import "../style/Image.css"
import 'leaflet-draw/dist/leaflet.draw.css'
import {Dropdown} from 'primereact/dropdown';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

import PopularCart from "../ui-component/cards/Skeleton/PopularCard";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Doc from "../assets/images/doc.png";
import Csv from "../assets/images/csv.png";
import NoFile from "../assets/images/nofile.png";


export default function Template() {


    const [productDialog, setProductDialog] = useState(false);
    const [resulteditDialog, setResultEditDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [name, setName] = useState('');
    const [file, setFile] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [image, setImages] = useState([]);
    const [result, setResult] = useState([]);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);
    const dt = useRef(null);
    const [selectedResult, setSelectedResult] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const navigate = useNavigate();
    const [namef, setNamef] = useState("");
    const [fields, setFields] = useState([]);






    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };


    useEffect(() => {
        fetchData();
        loadFields();
    }, []);

    const fetchData = async () => {
        try {
            const resultResponse = await axios.get('http://localhost:8080/api/result/all');
            setResult(resultResponse.data);
            handleDataTableLoad();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const loadFields = async () => {
        if (selectedResult) {
            const res = await axios.get(`http://localhost:8080/api/field/result/${selectedResult.id}`);
            setFields(res.data);
        }
    };

    const handleSubmit = (event) => {
        event?.preventDefault();
        axios.post("http://localhost:8080/api/result/save", {
            name,
            file,
            description,
            type,
        }).then(async (response) => {
            console.log(response.data);
            console.log(file);
            setName("");
            setFile("");
            setDescription("");
            setType("");

            await hideDialog();
            await loadResult();
            await fetchData();
            showusave();

            console.log("Navigation will be executed");

            if(response.data.type ==="doc"){
                navigate(`/template/template_details/${response.data.id}`);
            }else{

                navigate(`/template/template_detailsExcel/${response.data.id}`);

            }


        }).catch((error) => {
            console.error("Error while saving file:", error);
        });
    };

    /******************************************** Edit template ******************************************/


    const handleEdit = async () => {
        try {
            const updatedProject = {
                id: selectedResult.id,
                name,
                file,
                description,
                type,

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






    const saveAllFieldsWithResult = async () => {
        try {
            const csvDataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(file)}`;

            const resultResponse = await axios.post("http://localhost:8080/api/result/save", {
                name,
                description,
                type,
                file: csvDataUrl,
            });

            const resultId = resultResponse.data.id;

            const attributes = file.split("\n")[0].split(",");


            for (const attribute of attributes) {
                const trimmedAttribute = attribute.trim(); // Trim whitespace
                if (trimmedAttribute !== "") {
                    const fieldToSave = {
                        namef: trimmedAttribute.replace(/"/g, ""),
                        fieldid: trimmedAttribute.replace(/"/g, "").toUpperCase(),
                        type: "text",
                        result: { id: resultId },
                    };

                    await axios.post("http://localhost:8080/api/field/save", fieldToSave);
                }
            }
            showusave();

            navigate(`/template/template_detailsExcel/${resultResponse.data.id}`);

            console.log("Fields and result saved successfully!");

        } catch (error) {
            console.error("Error while saving fields and result:", error);
        }
    };

    const handlefileChange2 = (event) => {
        const files = event.files;

        if (files && files.length > 0) {
            const file = files[0];

            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileContent = e.target.result;
                console.log("FileReader Output:", fileContent);

                const lines = fileContent.split("\n");
                const firstRow = lines[0].split(",");
                console.log("First Row Attributes:", firstRow);

                //setName("");

                const nonEmptyAttributes = firstRow.filter(attribute => attribute.trim() !== "" && attribute.trim() !== "\"\"");
                console.log("Non-Empty Attributes:", nonEmptyAttributes);

                setFile(fileContent);

                if (nonEmptyAttributes.length > 0) {
                    setNamef(nonEmptyAttributes[0]);
                }


            };
            reader.readAsText(file);
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




    /******************************************** components *************************/


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New " icon="pi pi-plus" severity="success" onClick={openNew}/>
            </div>
        );
    };


    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog}/>
            <Button
                label="Create"
                severity="success"
                raised
                onClick={(e) => {
                    if (type === 'excel') {
                        saveAllFieldsWithResult();
                    } else {
                        handleSubmit(e);
                    }
                }}
            />

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
        if (rowData.type ) {
            let icon;

            if (rowData.type === 'doc') {
                icon = Doc;
            } else if (rowData.type === 'excel') {
                icon = Csv;
            } else {
                icon = <FileDownloadIcon />;
            }

            return (
                <a href={rowData.file} download>
                    <img  src={icon} alt="Download Icon" style={{ width: '30px', height: 'auto' }}/>

                </a>
            );
        } else {
            return <img src={NoFile} alt="NoFile" style={{ width: '30px', height: 'auto' }} />;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };


    /************************************************  Upload new file / delete all  the old fields "using Promise" and create the new files fields**********************************/



    const handlefileChange3 = async (event) => {
        const files = event.files;

        if (files && files.length > 0) {
            const file = files[0];

            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileContent = e.target.result;
                console.log('FileReader Output:', fileContent);

                const lines = fileContent.split('\n');
                const firstRow = lines[0].split(',');
                console.log('First Row Attributes:', firstRow);

                const nonEmptyAttributes = firstRow.filter(
                    (attribute) => attribute.trim() !== '' && attribute.trim() !== '""'
                );
                console.log('Non-Empty Attributes:', nonEmptyAttributes);

                try {

                    const deletePromises = fields.map((field) =>
                        axios.delete(`http://localhost:8080/api/field/${field.id}`)
                    );

                    await Promise.all(deletePromises);

                    console.log("Old fields deleted successfully.");

                    const resultId = selectedResult?.id || id;
                    const csvDataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(fileContent)}`;

                    if (selectedResult) {
                        const updatedResult = {
                            ...selectedResult,
                            file: csvDataUrl,
                        };

                        await axios.put(`http://localhost:8080/api/result/${selectedResult.id}`, updatedResult);
                        setResult(updatedResult);
                    } else {
                        const newResult = {
                            name: name,
                            file: csvDataUrl,
                            description: description,
                            type: 'excel',
                        };
                        const resultResponse = await axios.post('http://localhost:8080/api/result/save', newResult);
                        setResult(resultResponse.data);
                    }

                    for (const attribute of nonEmptyAttributes) {
                        const trimmedAttribute = attribute.trim();
                        const fieldToSave = {
                            namef: trimmedAttribute.replace(/"/g, ''),
                            fieldid: trimmedAttribute.replace(/"/g, '').toUpperCase(),
                            type: 'text',
                            result: { id: resultId },
                        };
                        await axios.post('http://localhost:8080/api/field/save', fieldToSave);
                    }

                    loadResult();
                    loadFields();

                    console.log('New fields and result saved successfully!');
                } catch (error) {
                    console.error('Error while updating result and saving new fields:', error);
                }
            };
            reader.readAsText(file);
        }
    };



    return (
        <>
            <Toast ref={toast}/>
            <ConfirmDialog/>
                <div className="card">
                    <Toolbar className="mb-4" start={leftToolbarTemplate} center={<strong>Manage Templates</strong>} end={rightToolbarTemplate}></Toolbar>


                    {dataTableLoaded ? (
                        <DataTable ref={dt} value={result}
                                   dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Templates" globalFilter={globalFilter} header={header}>
                            <Column field="id" header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                            <Column field="name" header="Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '10rem' }}  body={(rowData) => (
                                <Link className="font-bold" to={rowData.type === 'excel' ? `template_detailsExcel/${rowData.id}` : `template_details/${rowData.id}`}>
                                    {rowData.name}
                                </Link>)}></Column>
                            <Column field="description" header="Description" sortable style={{ minWidth: '10em' }}></Column>
                            <Column field="type" header="Type" sortable style={{ minWidth: '10em' }}></Column>
                            <Column field="file" header="file" body={resultFileBodyTemplate} sortable style={{ minWidth: '10rem' }} ></Column>
                            <Column  header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                        </DataTable>
                    ) : (
                        <PopularCart/>
                    )}


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
                            emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                            chooseLabel="Select File"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            onSelect={(e) => {
                                if (type === 'excel') {
                                    handlefileChange2(e);
                                } else {
                                    handlefileChange(e);
                                }
                            }}                        />

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
                    header="Update Template" modal className="p-fluid" footer={resulteditDialogFooter} onHide={hideeditDialog}
                    onShow={() => {
                        setName(selectedResult.name);
                        setDescription(selectedResult.description);
                        setType(selectedResult.type);
                    }}
            >
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
                            <InputText
                                placeholder={result.type}
                                style={{marginTop: "5px"}}
                                id="type"
                                value={type}
                                readOnly={true}
                                onChange={(event) => setType(event.value)}

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
                            disabled={type === 'excel'}

                            onSelect={(e) => {
                                if (type === 'excel') {
                                    handlefileChange3(e);
                                } else {
                                    handlefileChange(e);
                                }
                            }}                                             />

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
        