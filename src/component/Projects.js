import React, {useState, useRef, useEffect} from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "../style/Image.css"
import Switch from '@mui/material/Switch';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from "axios";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import EmptyImg from "../assets/images/empty.png"
import {Link} from "react-router-dom";
import {Dropdown} from "primereact/dropdown";
import PopularCart from "../ui-component/cards/Skeleton/PopularCard"



export default function Projects() {

    const [selectedProject, setSelectedProject] = useState(null);
    const [project, setProjects] =  useState([]);
    const [name, setName] =  useState('');
    const [description, setDescription] =  useState('');
    const [productDialog, setProductDialog] = useState(false);
    const [editproductDialog, seteditProductDialog] = useState(false);
    const [editPhotoDialog, seteditPhotoDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [clientId, setClientId] = useState("");
    const [resultId, setResultId] = useState("");
    const [clients, setClient] = useState([]);
    const [results, setResults] = useState([]);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const projectsWithPhotos = project.filter(rowData => rowData.images && rowData.images.length);
    const projectsWithFiles = project.filter(rowData => rowData.result && rowData.result.file);


    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/projet/all").then((response) => {
            setProjects(response.data);
            handleDataTableLoad();
        });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/api/users/role/CLIENT").then((response) => {
            setClient(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/api/result/all").then((response) => {
            setResults(response.data);
        });
    }, []);




    const loadProjects=async ()=>{
        const res=await axios.get(`http://localhost:8080/api/projet/all`);
        setProjects(res.data);
    }

    /***********************Save **************/


    const handleSubmit = (event) => {
        event.preventDefault();

        if (name.trim() === '' || description.trim() === '') {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
            return;
        }

        const requestData = {
            name,
            description,
            user: {
                id: clientId,
                role: "CLIENT"
            }
        };

        if (resultId) {
            requestData.result = {
                id: resultId
            };
        }

        axios.post("http://localhost:8080/api/projet/save", requestData)
            .then((response) => {
                console.log("API Response:", response.data);
                setName("");
                setDescription("");
                setSubmitted(true);
                hideDialog();
                loadProjects();
                showusave();
            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };


    /********************************************* Delete ***************************************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`http://localhost:8080/api/projet/${id}`)
                .then(() => {
                    setProjects(project.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'Project deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting project:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'project assigned to an image or a comment', life: 3000});
                });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Project ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
    };



    const openNew = () => {
        setProjects(project);
        setSubmitted(false);
        setDescription("");
        setName("");
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideeditDialog = () => {
        seteditProductDialog(false);
    };
    const hideeditPhotoDialog = () => {
        seteditPhotoDialog(false);
    };


    /***********************Update **************/

    const handleupdate = (rowData) => {
        setSelectedProject(rowData);
        setName(rowData.name);
        setDescription(rowData.description);
        setClientId(rowData.user.id);
        //setResultId(rowData.result ? rowData.result.id : "");
        seteditProductDialog(true);
    };

    const handlePhotoupdate = (rowData) => {
        setSelectedProject(rowData);
        setName(rowData.name);
        setDescription(rowData.description);
        setClientId(rowData.user.id);
        setResultId(rowData.result ? rowData.result.id : "");
        seteditPhotoDialog(true);
    };

    const handleEdit = async () => {
        try {
            const updatedProject = {
                id: selectedProject.id,
                name,
                description,
                user: {
                    id: clientId,
                    role: "CLIENT"
                }
            };

            if (resultId) {
                updatedProject.result = {
                    id: resultId
                };
            }

            const response = await axios.put(`http://localhost:8080/api/projet/${selectedProject.id}`, updatedProject);

            const updatedProjects = project.map((proj) =>
                proj.id === response.data.id ? response.data : proj
            );

            setProjects(updatedProjects);
            hideeditPhotoDialog();
            hideeditDialog();
            loadProjects();
            showupdate();
        } catch (error) {
            console.error(error);
        }
    };

    /***********************Toasts **************/

    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'item updated successfully', life: 3000});
    }
    const showusave = () => {
        toast.current.show({severity:'success', summary: 'success', detail:'item added successfully', life: 3000});
    }


    /***********************csv **************/


    const exportCSV = () => {
        dt.current.exportCSV();
    };



    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button   label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const centerToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 font-bold">Manage Projects</h4>
        </div>;
    };



    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined style={{marginRight:"4px"}} onClick={() => handleupdate(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => handleDelete(rowData.id)} />
            </React.Fragment>
        );
    };
    const actionPhotoBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined style={{marginRight:"4px"}} onClick={() => handlePhotoupdate(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => handleDelete(rowData.id)} />
            </React.Fragment>
        );
    };


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button  label="save"
                     severity="success"
                     raised onClick={(e) => handleSubmit(e)}/>
        </React.Fragment>
    );
    const editPhotoDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideeditPhotoDialog} />
            <Button label="Update" severity="info"  raised onClick={() => handleEdit(selectedProject)} />
        </React.Fragment>
    );
    const editproductDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideeditDialog} />
            <Button label="Update" severity="info"  raised onClick={() => handleEdit(selectedProject)} />
        </React.Fragment>
    );


    const photoBodyTemplate = (rowData) => {
        if (rowData.images && rowData.images.length > 0) {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', justifyContent: 'center' }}>
                    {rowData.images.map((image) => (
                        <Link to={`imagedetail/${image.id}`}>
                        <img
                            key={image.id}
                            src={image.photo}
                            alt={image.name}
                            className="image-item-small"

                            onError={() => console.error(`Failed to load image for ID: ${image.id}`)}
                        />
                        </Link>
                    ))}
                </div>
            );
        } else {
            return <img src={EmptyImg} alt="No" style={{ width: '50px', height: 'auto' }} />;
        }
    };



    const resultFileBodyTemplate = (rowData) => {
        if (rowData.result && rowData.result.file) {
            return (
                <a href={rowData.result.file} download>
                    <FileDownloadIcon /> Download
                </a>
            );
        }
        return null;
    };



    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                {dataTableLoaded ? (
                <DataTable ref={dt} value={projectsWithPhotos}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} image projects" globalFilter={globalFilter} header={header}>
                    <Column field="id" header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                    <Column field="name" header="Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '10rem' }}  body={(rowData) => (
                        <Link className="font-bold" to={`project_details/${rowData.id}`}>{rowData.name}</Link>
                    )}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth: '10em' }}></Column>
                    <Column field="photo" header="Photo" body={photoBodyTemplate} sortable style={{ minWidth: '18rem' }} ></Column>
                    <Column header="Client" field="user.firstName" filter filterPlaceholder="Search Client ..." sortable style={{ minWidth: '7rem' }} body={(rowData) => rowData.user?.firstName}></Column>
                    <Column field="dateCreation" header="Creation_Date" sortable sortField="dateCreation" style={{ minWidth: "10rem" }}></Column>
                    <Column  header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
                ) : (
                    <PopularCart/>
                )}
            </div>


            <div className="card mt-5">
                {dataTableLoaded ? (
                    <DataTable ref={dt} value={projectsWithFiles}
                               dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} template projects" globalFilter={globalFilter} header={header}>
                        <Column field="id" header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '10rem' }}  body={(rowData) => (
                            <Link className="font-bold" to={`project_detailsDoc/${rowData.id}`}>{rowData.name}</Link>
                        )}></Column>
                        <Column header="Result File" body={resultFileBodyTemplate} style={{ minWidth: '12rem' }} />
                        <Column field="result.name" header="Template Name" sortable style={{ minWidth: '10rem' }} />
                        <Column field="description" header="Description" sortable style={{ minWidth: '10em' }}></Column>
                        <Column  field="user.firstName" header="Client" filter filterPlaceholder="Search Client ..." sortable style={{ minWidth: '7rem' }} body={(rowData) => rowData.user?.firstName}></Column>
                        <Column field="dateCreation" header="Creation_Date" sortable sortField="dateCreation" style={{ minWidth: "10rem" }}></Column>
                        <Column  header="Action" body={actionPhotoBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                ) : (
                    <PopularCart/>
                )}
            </div>



            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Project" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Add a Template ?
                    </label>
                    <Switch
                        checked={showTemplateDropdown}
                        onChange={() => setShowTemplateDropdown(!showTemplateDropdown)}
                        color="primary"
                    />
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold ">
                        Name
                    </label>
                    <InputText style={{marginTop:"5px"}} id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    {submitted && !name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea  style={{marginTop:"5px"}} id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Client
                    </label>
                    <Dropdown
                        style={{marginTop:"5px"}}
                        value={clientId}
                        options={clients.map((client) => ({ label: client.firstName, value: client.id }))}
                        onChange={(e) => setClientId(e.value)}
                        placeholder="Select a client"
                    />
                </div>
                {showTemplateDropdown && (
                    <div className="field mt-2">
                        <label htmlFor="description" className="font-bold">
                            Template
                        </label>
                        <Dropdown
                            style={{ marginTop: "5px" }}
                            value={resultId}
                            options={results.map((result) => ({ label: result.name, value: result.id }))}
                            onChange={(e) => setResultId(e.value)}
                            placeholder="Select a template"
                        />
                    </div>
                )}
            </Dialog>


            <Dialog  visible={editproductDialog}
                     style={{ width: '40rem' }}
                     breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                     header="Edit Project"
                     modal
                     className="p-fluid"
                     footer={editproductDialogFooter}
                     onHide={hideeditDialog}
            >

                <div className="field">
                    <label htmlFor="newname" className="font-bold mb-4">
                        Name
                    </label>
                    <InputText style={{marginTop:"5px"}} id="newname" value={name} onChange={(e) => setName(e.target.value)} required />
                    {submitted && !name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field mt-2">
                    <label htmlFor="newdescription" className="font-bold">
                        Description
                    </label>
                    <InputTextarea style={{marginTop:"5px"}} id="newdescription" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Client
                    </label>
                    <Dropdown
                        style={{marginTop:"5px"}}
                        value={clientId}
                        options={clients.map((client) => ({ label: client.firstName, value: client.id }))}
                        onChange={(e) => setClientId(e.value)}
                        placeholder="Select a client"
                    />  </div>

            </Dialog>









            <Dialog  visible={editPhotoDialog}
                     style={{ width: '40rem' }}
                     breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                     header="Edit Project"
                     modal
                     className="p-fluid"
                     footer={editPhotoDialogFooter}
                     onHide={hideeditPhotoDialog}
            >

                <div className="field">
                    <label htmlFor="newname" className="font-bold mb-4">
                        Name
                    </label>
                    <InputText style={{marginTop:"5px"}} id="newname" value={name} onChange={(e) => setName(e.target.value)} required />
                    {submitted && !name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field mt-2">
                    <label htmlFor="newdescription" className="font-bold">
                        Description
                    </label>
                    <InputTextarea style={{marginTop:"5px"}} id="newdescription" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Client
                    </label>
                    <Dropdown
                        style={{marginTop:"5px"}}
                        value={clientId}
                        options={clients.map((client) => ({ label: client.firstName, value: client.id }))}
                        onChange={(e) => setClientId(e.value)}
                        placeholder="Select a client"
                    />  </div>

                    <div className="field mt-2">
                        <label htmlFor="description" className="font-bold">
                            Template
                        </label>
                        <Dropdown
                            style={{ marginTop: "5px" }}
                            value={resultId}
                            options={results.map((result) => ({ label: result.name, value: result.id }))}
                            onChange={(e) => setResultId(e.value)}
                            placeholder="Select a template"
                        />
                    </div>

            </Dialog>



        </div>
    );
}
