import React, {useState, useEffect,useRef} from "react";
import MainCard from "../ui-component/cards/MainCard";
import axios from "axios";
import NoImg from "../assets/images/nopic.png"
import NoFile from "../assets/images/nofile.png"
import {Grid} from "@mui/material";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import Card from "@mui/material/Card";
import {Button} from 'primereact/button';
import "../style/buttonGuide.css"
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import { Tag } from 'primereact/tag';
import { Paginator } from 'primereact/paginator';
import {Link} from "react-router-dom";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {InputText} from "primereact/inputtext";
import {Toolbar} from "primereact/toolbar";
import PopularCart from "../ui-component/cards/Skeleton/PopularCard";

export default function AllComments() {
    const [project, setProjects] = useState([]);
    const [selectedProjectComments, setSelectedProjectComments] = useState([]);
    const [selectedPageComments, setSelectedPageComments] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 2;
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [projectUnreadCounts, setProjectUnreadCounts] = useState({});
    const toast = useRef(null);
    const dt = useRef(null);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);

    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };


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
        const res = await axios.get("http://localhost:8080/api/projet/role/CLIENT");
        setProjects(res.data);
    };

    const photoBodyTemplate = (rowData) => {
        if (rowData.images && rowData.images.length > 0) {
            return (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 2fr)',
                    gap: '2px',
                    justifyContent: 'center'
                }}>
                    {rowData.images.map((image) => (
                        <img
                            src={image.photo}
                            alt={image.name}
                            style={{width: '30px', height: 'auto'}}
                            className="image-item-small"
                            onError={() => console.error(`Failed to load image for ID: ${image.id}`)}
                        />
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
                const res = await axios.get("http://localhost:8080/api/projet/role/CLIENT");
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
                const res = await axios.get(`http://localhost:8080/api/comment/projet/${projectId}`);
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
            axios.delete(`http://localhost:8080/api/comment/${commentId}`)
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
            .put(`http://localhost:8080/api/comment/read/${commentId}`, {
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
            return (
                <a href={rowData.result.file} download>
                    <FileDownloadIcon /> Download
                </a>
            );
        } else {
            return <img src={NoFile} alt="NoFile" style={{width: '30px', height: 'auto'}}/>;

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

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };




    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />

            <MainCard>

                <Toolbar className="mb-4"  start={<strong>ALl Comments</strong>} end={rightToolbarTemplate}></Toolbar>
                {dataTableLoaded ? (
                <DataTable ref={dt} value={project}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Image and Template projects" globalFilter={globalFilter} header={header}>
                    <Column field="id" header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                    <Column field="name" header="Project Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '10rem' }}  body={(rowData) => (
                        <Link
                            className="font-bold"
                            to={rowData.images && rowData.images.length > 0  ? `project_details/${rowData.id}` : `project_detailsDoc/${rowData.id}`}
                        >   {rowData.name}
                        </Link>)}></Column>

                    <Column header="Client" field="user.firstName" filter filterPlaceholder="Search Client ..." sortable style={{ minWidth: '7rem' }} body={(rowData) => rowData.user?.firstName}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth: '10em' }}></Column>
                    <Column field="photo" header="Photo" body={photoBodyTemplate} sortable style={{ minWidth: '10rem' }} ></Column>
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
                </DataTable>
                ) : (
                    <PopularCart/>
                )}

                <Grid item xs={12} className="mt-5" >

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

        </>
    );
}