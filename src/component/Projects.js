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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import EmptyImg from "../assets/images/empty.png"

export default function Projects() {

    const [selectedProject, setSelectedProject] = useState(null);
    const [project, setProjects] =  useState([]);
    const [name, setName] =  useState('');
    const [description, setDescription] =  useState('');
    const [productDialog, setProductDialog] = useState(false);
    const [editproductDialog, seteditProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/projet/all").then((response) => {
            setProjects(response.data);
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
            toast.current.show({ severity: 'error', summary: 'Successful', detail: 'empty', life: 3000 });
            return;
        }

        axios.post("http://localhost:8080/api/projet/save", {
            name,
            // dateCreation,
            description,
            gestionnaire: {
                id: 1,
                role: "GESTIONNAIRE"
            },
        })
            .then((response) => {
                console.log("API Response:", response.data);
                setName("");
                setDescription("");
                setSubmitted(true);
                hideDialog();
                loadProjects();
                showusave();
                //  setDateCreation(new Date());
                //  setGestionnaireid("");
                //setProductDialog(false);
                // setProjects([...updatedProjects, response.data]);
            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };


    /***********************Delete **************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`http://localhost:8080/api/projet/${id}`)
                .then(() => {
                    setProjects(project.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'Project deleted successfully', life: 3000});
                })
                .catch((error) => {
                    // Handle the error here, you can show an error toast or handle it as needed
                    console.error('Error deleting project:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'project assigned to an image', life: 3000});
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


    /***********************Update **************/

    const handleupdate = (rowData) => {
        setSelectedProject(rowData);
        setName(rowData.name);
        setDescription(rowData.description);
        //setDateCreation(new Date(rowData.dateCreation));
        seteditProductDialog(true);
    };

    const handleEdit = async (projectToUpdate) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/projet/${projectToUpdate.id}`, {
                name: name,
                description: description,
                //dateCreation: dateCreation,
            });

            const updatedProject = [...project];
            const updatedProjectIndex = updatedProject.findIndex((project) => project.id === projectToUpdate.id);
            updatedProject[updatedProjectIndex] = response.data;

            hideeditDialog();
            loadProjects();
            showupdate()
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
                        <img
                            key={image.id}
                            src={image.photo}
                            alt={image.name}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            onError={() => console.error(`Failed to load image for ID: ${image.id}`)}
                        />
                    ))}
                </div>
            );
        } else {
            return <img src={EmptyImg} alt="No" style={{ width: '50px', height: 'auto' }} />;
        }
    };






    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={project}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column field="id" header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                    <Column field="name" header="Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth: '10em' }}></Column>
                    <Column field="photo" header="Photo" body={photoBodyTemplate} sortable style={{ minWidth: '12rem' }} ></Column>
                    <Column field="dateCreation" header="Creation_Date" sortable sortField="dateCreation" style={{ minWidth: "10rem" }}></Column>
                    <Column  header="Action"body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Project" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
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



            </Dialog>


        </div>
    );
}
