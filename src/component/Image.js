
import React, {useState, useRef, useEffect} from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import axios from "axios";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Grid} from "@mui/material";
import {Box} from "@mui/system";




export default function Image() {


    const [productDialog, setProductDialog] = useState(false);

    const [editproductDialog, seteditProductDialog] = useState(false);

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [description, setDescription] = useState('');
    const [format, setFormat] = useState('');
    const [projetId, setProjetId] = useState("");
    const [projet, setProjet] = useState([]);
    const [image, setImages] =  useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const projetResponse = await axios.get('http://localhost:8080/api/projet/all');
            setProjet(projetResponse.data);

            const imageResponse = await axios.get('http://localhost:8080/api/image/all');
            setImages(imageResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (event) => {
        event?.preventDefault();
        axios.post("http://localhost:8080/api/image/save", {
            name,
            photo,
            description,
            format,
            projet: {
                id: projetId
            }
        }).then((response) => {
            console.log(response.data);
            console.log(photo);
            setName("");
            setPhoto("");
            setDescription("");
            setFormat("");
            setProjetId("");
            hideDialog();
            loadImage();
            showusave();
        }).catch((error) => {
            console.error("Error while saving image:", error);
        });
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];

        if (!file || !file.type.startsWith('image/')) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhoto(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    /********************************************Load image *************************/
    const loadImage=async ()=>{
        const res=await axios.get(`http://localhost:8080/api/image/all`);
        setImages(res.data);
    }





    /******************************************** Delete *************************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`http://localhost:8080/api/image/${id}`)
                .then(() => {
                    setImages(image.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'Image deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting project:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'failed to delete Image', life: 3000});
                });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Image ?',
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
        setImages(image);
        setSubmitted(false);
        setDescription("");
        setName("");
        setPhoto("");
        setDescription("");
        setFormat("");
        setProjetId("");
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };
    const hideeditDialog = () => {
        // setSubmitted(false);
        seteditProductDialog(false);
    };


    /***********************Update **************/

    const handleupdate = (rowData) => {
        setSelectedProject(rowData);
        setName(rowData.name);
        setDescription(rowData.description);
        setPhoto(rowData.photo);
        setFormat(rowData.format);
        seteditProductDialog(true);
    };

    const handleEdit = async (projectToUpdate) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/image/${projectToUpdate.id}`, {
                name:name,
                photo:photo,
                description:description,
                format:format,
                projet: {
                    id: projetId
                }
            });

            const updatedProject = [...image];
            const updatedProjectIndex = updatedProject.findIndex((image) => image.id === projectToUpdate.id);
            updatedProject[updatedProjectIndex] = response.data;

            hideeditDialog();
            loadImage();
            showupdate()
        } catch (error) {
            console.error(error);
        }
    };

    /********************************************Toasts *************************/

    const showusave = () => {
        toast.current.show({severity:'success', summary: 'success', detail:'item added successfully', life: 3000});
    }

    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'item updated successfully', life: 3000});
    }





    const exportCSV = () => {
        dt.current.exportCSV();
    };

    /******************************************** components *************************/


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





    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined style={{marginRight:"4px"}} onClick={() => handleupdate(rowData)} />
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
    const editimageDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideeditDialog} />
            <Button label="Update" severity="info"  raised onClick={() => handleEdit(selectedProject)} />
        </React.Fragment>
    );



    const photoBodyTemplate = (rowData) => {
        if (rowData.photo) {
            return (
                <img
                    src={rowData.photo}
                    alt={rowData.photo}
                    style={{ width: '100px', height: 'auto' }}
                    onError={() => console.error(`Failed to load image for row with ID: ${rowData.id}`)}
                />
            );
        }
        // If photo is missing or empty, display a placeholder image or message
        return <img src="https://example.com/placeholder-image.jpg" alt="No" style={{ width: '100px', height: 'auto' }} />;
    }

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={image}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="photo" header="Photo" body={photoBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="description" header="Description" ></Column>
                    <Column field="format" header="Format"  sortable style={{ minWidth: '8rem' }}></Column>
                    <Column header="Projet" style={{ minWidth: '10rem' }} body={(rowData) => rowData.projet.name}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Image" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                     <Box className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={name} onChange={(event) => setName(event.target.value)} required autoFocus />
                    {submitted && !image.name && <small className="p-error">Name is required.</small>}
                </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box className="field">
                            <label htmlFor="format" className="font-bold ">
                                Format
                            </label>
                            <InputText id="format"  value={format} onChange={(event) => setFormat(event.target.value)} mode="currency" currency="USD" locale="en-US" />
                        </Box>
                    </Grid>
                </Grid>
                <Box className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} cols={20} />
                </Box>


                    <Grid item xs={12} >
                        <Box className="field mt-2">
                            <label htmlFor="quantity" className="font-bold">
                                Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="photo"
                                onChange={handlePhotoChange}
                                className="form-control custom-file-input"
                                style={{
                                    width: '100%',
                                    height: '38px', // Adjust the height as needed
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                    color: '#495057',
                                    backgroundColor: '#fff',
                                    backgroundClip: 'padding-box',
                                    border: '1px solid #ced4da',
                                    borderRadius: '0.25rem',
                                    marginBottom: '2rem',
                                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} >
                        <Box className="field ">
                            <label htmlFor="description" className="font-bold">
                                Project
                            </label>
                            <select
                                id="projetId"
                                className="form-control"
                                value={projetId}
                                onChange={(event) => setProjetId(event.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                }}
                            >
                                <option value="">Select Projet</option>
                                {projet &&
                                    projet.map((projet) => (
                                        <option key={projet.id} value={projet.id}>
                                            {projet.name}
                                        </option>
                                    ))}
                            </select>
                        </Box>
                    </Grid>

            </Dialog>

            <Dialog visible={editproductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Edit Image" modal className="p-fluid" footer={editimageDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box className="field">
                            <label htmlFor="name" className="font-bold">
                                Name
                            </label>
                            <InputText  id="name" value={name} onChange={(event) => setName(event.target.value)} required autoFocus />
                            {submitted && !image.name && <small className="p-error">Name is required.</small>}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box className="field">
                            <label htmlFor="format" className="font-bold ">
                                Format
                            </label>
                            <InputText className="mt-2" id="format"  value={format} onChange={(event) => setFormat(event.target.value)} mode="currency" currency="USD" locale="en-US" />
                        </Box>
                    </Grid>
                </Grid>
                <Box className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea className="mt-2" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} cols={20} />
                </Box>


                <Grid item xs={12} >
                    <Box className="field mt-2">
                        <label htmlFor="quantity" className="font-bold">
                            Photo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="photo"
                            onChange={handlePhotoChange}
                            className="form-control custom-file-input mt-2"
                            style={{
                                width: '100%',
                                height: '38px', // Adjust the height as needed
                                padding: '0.375rem 0.75rem',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                color: '#495057',
                                backgroundColor: '#fff',
                                backgroundClip: 'padding-box',
                                border: '1px solid #ced4da',
                                borderRadius: '0.25rem',
                                marginBottom: '2rem',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} >
                    <Box className="field ">
                        <label htmlFor="description" className="font-bold">
                            Project
                        </label>
                        <select
                            id="projetId"
                            className="form-control"
                            value={projetId}
                            onChange={(event) => setProjetId(event.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem 1rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                            }}
                        >
                            <option value="">Select Projet</option>
                            {projet &&
                                projet.map((projet) => (
                                    <option key={projet.id} value={projet.id}>
                                        {projet.name}
                                    </option>
                                ))}
                        </select>
                    </Box>
                </Grid>

            </Dialog>


        </div>
    );
}
        