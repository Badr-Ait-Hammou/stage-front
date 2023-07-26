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
            message: 'Are you sure you want to Delete this Restaurant ?',
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
       // setSubmitted(false);
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
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="dateCreation" header="Creation_Date" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Project" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold mb-4">
                        Name
                    </label>
                    <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    {submitted && !name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
            </Dialog>


            <Dialog  visible={editproductDialog}
                     style={{ width: '32rem' }}
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
                    <InputText id="newname" value={name} onChange={(e) => setName(e.target.value)} required />
                    {submitted && !name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="newdescription" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="newdescription" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>



            </Dialog>


        </div>
    );
}
