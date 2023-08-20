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
import axios from "../utils/axios";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Doc from "../assets/images/doc.png";
import Csv from "../assets/images/csv.png";
import {Link} from "react-router-dom";
import {Dropdown} from "primereact/dropdown";
import PopularCart from "../ui-component/cards/Skeleton/PopularCard"
import NoImg from "../assets/images/nopic.png";
import NoFile from "../assets/images/nofile.png";
import MainCard from "../ui-component/cards/MainCard";
import {Grid} from "@mui/material";
import Card from "@mui/material/Card";
import {Tag} from "primereact/tag";
import {Paginator} from "primereact/paginator";
import Alert from '@mui/material/Alert';








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
    //const projectsWithPhotos = project.filter(rowData => rowData.images && rowData.images.length);
    //const projectsWithFiles = project.filter(rowData => rowData.result && rowData.result.file);
    const [showDialog, setShowDialog] = useState(false);


    const [selectedProjectComments, setSelectedProjectComments] = useState([]);
    const [selectedPageComments, setSelectedPageComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 2;
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [projectUnreadCounts, setProjectUnreadCounts] = useState({});

    /********************************************** ******************************************************/
    useEffect(() => {
        loadProjects();
        handleDataTableLoad();

    }, []);

    useEffect(() => {
        if (selectedProjectId && selectedProjectComments.length > 0) {
            const unreadCount = selectedProjectComments.filter(comment => comment.status === 'unread').length;
            setProjectUnreadCounts(prevCounts => ({
                ...prevCounts,
                [selectedProjectId]: unreadCount
            }));
        }
    }, [selectedProjectComments]);



    const loadProjects = async () => {
        const res = await axios.get("/api/projet/role/CLIENT");
        setProjects(res.data);
    };

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
            return <img src={NoImg} alt="No" style={{width: '30px', height: 'auto'}}/>;
        }
    };

    useEffect(() => {
        const loadProjectsAndUnreadCounts = async () => {
            try {
                const res = await axios.get("/api/projet/role/CLIENT");
                setProjects(res.data);

                const unreadCounts = {};
                res.data.forEach((project) => {
                    unreadCounts[project.id] = project.commentList.filter(comment => comment.status === 'unread').length;
                });
                setProjectUnreadCounts(unreadCounts);
            } catch (error) {
                console.error("Failed to load projects: ", error);
            }
        };

        loadProjectsAndUnreadCounts();
    }, []);

    const handleProjectClick = async (projectId) => {
        try {
            if (selectedProjectId === projectId) {
                setSelectedPageComments([]);
                setSelectedProjectId(null);
            } else {
                const res = await axios.get(`/api/comment/projet/${projectId}`);
                setSelectedProjectComments(res.data);
                setSelectedPageComments(res.data.slice(0, cardsPerPage));
                setSelectedProjectId(projectId);
                setCurrentPage(0);
            }
        } catch (error) {
            console.error("Failed to load comments for the project with ID: ", projectId);
        }
    };


    function formatDateTime(dateTime) {
        const dateObj = new Date(dateTime);
        const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
        return `${formattedDate} - ${formattedTime}`;
    }


    /******************************************************* Delete comment **************************************/


    const handleDeleteComment = (commentId) => {
        const confirmDelete = () => {
            axios.delete(`/api/comment/${commentId}`)
                .then((response) => {
                    console.log("Comment deleted:", response.data);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Done',
                        detail: 'Comment deleted successfully',
                        life: 3000
                    });

                    setSelectedProjectComments(prevComments =>
                        prevComments.filter(comment => comment.id !== commentId)
                    );

                    setSelectedPageComments(prevComments =>
                        prevComments.filter(comment => comment.id !== commentId)
                    );
                })
                .catch((error) => {
                    console.error("Error while deleting comment:", error);
                });
        }
        confirmDialog({
            message: 'Are you sure you want to Delete this Comment ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
    };

    /******************************************************* Mark as Read  **************************************/


    const handleMarkAsRead = (commentId) => {
        axios
            .put(`/api/comment/read/${commentId}`, {
                status: "read",
            })
            .then(() => {
                const updatedComments = selectedProjectComments.map((comment) =>
                    comment.id === commentId ? { ...comment, status: "read" } : comment
                );

                setProjectUnreadCounts(prevCounts => ({
                    ...prevCounts,
                    [selectedProjectId]: Math.max(0, prevCounts[selectedProjectId] - 1)
                }));
                setSelectedProjectComments(updatedComments);

                setSelectedPageComments(prevComments =>
                    prevComments.map(comment => comment.id === commentId ? { ...comment, status: "read" } : comment)
                );

                toast.current.show({
                    severity: 'info',
                    summary: 'Done',
                    detail: 'Comment marked as read',
                    life: 3000
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };




    const resultFileBodyTemplate = (rowData) => {
        if (rowData.result && rowData.result.file) {
            let icon;

            if (rowData.result.type === 'doc') {
                icon = Doc;
            } else if (rowData.result.type === 'excel') {
                icon = Csv;
            } else {
                icon = <FileDownloadIcon />;
            }

            return (
                <a href={rowData.result.file} download>
                    <img  src={icon} alt="Download Icon" style={{ width: '30px', height: 'auto' }}/>

                </a>
            );
        } else {
            return <img src={NoFile} alt="NoFile" style={{ width: '30px', height: 'auto' }} />;
        }
    };






    const CommentsColumnContent = ({ rowData, handleProjectClick, selectedProjectId, unreadCount }) => {
        return (
            <div className="button-container">
                <Button
                    style={{ alignItems: "center", justifyContent: "center", position: "relative" }}
                    onClick={() => handleProjectClick(rowData.id)}
                    className={`show-comments-button  ${selectedProjectId === rowData.id ? 'active' : ''}`}
                >
                    {selectedProjectId === rowData.id ? "Hide" : "Show"}
                </Button>
                {unreadCount > 0 && (
                    <span className="unread-comment-count-top-right">{unreadCount}</span>
                )}
            </div>
        );
    };


    /********************************************** ******************************************************/


    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };

    useEffect(() => {
        axios.get("/api/projet/all").then((response) => {
            setProjects(response.data);
            handleDataTableLoad();
        });
    }, []);

    useEffect(() => {
        axios.get("/api/users/role/CLIENT").then((response) => {
            setClient(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get("/api/result/all").then((response) => {
            setResults(response.data);
        });
    }, []);






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

        axios.post("/api/projet/save", requestData)
            .then((response) => {
                console.log("API Response:", response.data);
                setName("");
                setDescription("");
                setResultId("");
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
            axios.delete(`/api/projet/${id}`)
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

            const response = await axios.put(`/api/projet/${selectedProject.id}`, updatedProject);

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
        if (rowData.result && rowData.result.file) {
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" rounded outlined style={{marginRight:"4px"}} onClick={() => handlePhotoupdate(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => handleDelete(rowData.id)} />
                </React.Fragment>);
        } else {
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" rounded outlined style={{marginRight:"4px"}} onClick={() => handleupdate(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => handleDelete(rowData.id)} />
                </React.Fragment>
            );
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











    return (
        <>
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <MainCard>

                <Toolbar className="mb-4" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                {dataTableLoaded ? (
                    <DataTable ref={dt} value={project}
                               dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Image and Template projects" globalFilter={globalFilter} header={header}>
                        <Column field="id" header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                        <Column field="name" header="Project Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '10rem' }}  body={(rowData) => (
                            <Link
                                className="font-bold"
                                onClick={(e) => {
                                    if (!(rowData.images && rowData.images.length > 0) && !(rowData.result && rowData.result.type === "excel") && !(rowData.result && rowData.result.type === "doc")) {
                                        e.preventDefault();
                                        setShowDialog(true);
                                    }
                                }}
                                to={
                                    rowData.images && rowData.images.length > 0
                                        ? `project_details/${rowData.id}`
                                        : rowData.result && rowData.result.type === "excel"
                                            ? `project_detailsExcel/${rowData.id}`
                                            : rowData.result && rowData.result.type === "doc"
                                                ? `project_detailsDoc/${rowData.id}`
                                                : ''
                                }
                            >   {rowData.name}
                            </Link>)}></Column>

                        <Column header="Client" field="user.firstName" filter filterPlaceholder="Search Client ..." sortable style={{ minWidth: '7rem' }} body={(rowData) => rowData.user?.firstName}></Column>
                        <Column field="description" header="Description" sortable style={{ minWidth: '10em' }}></Column>
                        <Column field="photo" header="Photo" body={photoBodyTemplate} sortable style={{ minWidth: '18rem' }} ></Column>
                        <Column field="result.file" header="file" filter body={resultFileBodyTemplate} sortable style={{ minWidth: '10rem' }} ></Column>
                        <Column field="dateCreation" header="Creation_Date" sortable sortField="dateCreation" style={{ minWidth: "10rem" }}></Column>
                        <Column
                            header="Comments"
                            body={(rowData) => (
                                <CommentsColumnContent
                                    rowData={rowData}
                                    handleProjectClick={handleProjectClick}
                                    selectedProjectId={selectedProjectId}
                                    unreadCount={projectUnreadCounts[rowData.id] || 0}
                                />

                            )}
                        />
                        <Column  header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

                    </DataTable>
                ) : (
                    <PopularCart/>
                )}

                <Grid item  xs={12} className="mt-5" >

                    <strong>Comments:</strong>
                    {project.map((project) => (
                        <React.Fragment key={project.id}>
                            {selectedProjectId === project.id && (
                                <div>
                                    {selectedPageComments.length === 0 ? (
                                        <Card
                                            className="mt-5"
                                            style={{
                                                backgroundColor: "rgba(252,67,67,0.18)",
                                                padding: "20px",
                                                borderRadius: "10px",
                                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                position: "relative",
                                            }}
                                        >     <strong>No comments available for this project.</strong>
                                        </Card>
                                    ) : (
                                        selectedPageComments.map((comment) => (

                                            <Card
                                                key={comment.id}
                                                className="mt-5"
                                                style={{
                                                    backgroundColor: "rgb(236,230,245)",
                                                    padding: "20px",
                                                    borderRadius: "10px",
                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                    position: "relative",
                                                }}
                                            >
                                                {comment.status === 'read' && (
                                                    <Tag value="You Read This" severity="success"></Tag>
                                                )}
                                                {comment.status === 'unread' && (
                                                    <Tag value="confirm reading comment" severity="warning"></Tag>
                                                )}
                                                {/*<Rating value={comment.rate} readOnly cancel={false} style={{ fontSize: '18px', marginTop: '10px' }} />*/}
                                                <p style={{ fontSize: '25px', marginTop: '10px' }}>{comment.note}</p>
                                                <p style={{ fontSize: '15px', marginTop: '10px' }}>
                                                    {formatDateTime(comment.commentDate)}
                                                </p>
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '10px',
                                                        right: '10px',
                                                        display: 'flex',
                                                    }}
                                                >

                                                    <Button
                                                        icon="pi pi-trash"
                                                        rounded
                                                        outlined
                                                        severity="danger"
                                                        style={{ marginRight: '4px', padding: '8px', fontSize: '12px' }}
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                    /> {!comment.status || comment.status === 'unread' ? (
                                                    <Button
                                                        icon="pi pi-eye"
                                                        rounded
                                                        outlined
                                                        severity="success"
                                                        style={{ marginRight: '4px', padding: '8px', fontSize: '12px' }}
                                                        onClick={() => handleMarkAsRead(comment.id)}
                                                    />
                                                ) : null}
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                    <div className="mt-3">
                                        <Paginator
                                            first={currentPage * cardsPerPage}
                                            rows={cardsPerPage}
                                            totalRecords={selectedProjectComments.length}
                                            onPageChange={(e) => {
                                                setCurrentPage(e.page);
                                                setSelectedPageComments(
                                                    selectedProjectComments.slice(e.first, e.first + e.rows)
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                </Grid>

            </MainCard>







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
            {/*
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
            */}

            <Dialog
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                style={{ width: '20rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            >
                <Alert variant="filled" severity="error">
                    This project is empty !</Alert>

            </Dialog>


            </>
    );
}
