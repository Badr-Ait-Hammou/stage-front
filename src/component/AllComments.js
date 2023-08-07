import React, {useState, useEffect,useRef} from "react";
import MainCard from "../ui-component/cards/MainCard";
import axios from "axios";
import {Panel} from "primereact/panel";
import {Grid} from "@mui/material";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import EmptyImg from "../assets/images/empty.png";
import Card from "@mui/material/Card";
import {Rating} from "primereact/rating";
import {Button} from 'primereact/button';
import "../style/buttonGuide.css"
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import { Tag } from 'primereact/tag';
import { Paginator } from 'primereact/paginator';

export default function AllComments() {
    const [users, setUsers] = useState([]);
    const [selectedProjectComments, setSelectedProjectComments] = useState([]);
    const [selectedPageComments, setSelectedPageComments] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 2;
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        const res = await axios.get("http://localhost:8080/api/users/role/CLIENT");
        setUsers(res.data);
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
            return <img src={EmptyImg} alt="No" style={{width: '30px', height: 'auto'}}/>;
        }
    };

    const handleProjectClick = async (projectId) => {
        try {
            if (selectedProjectId === projectId) {
                setSelectedPageComments([]);
                setSelectedProjectId(null);
            } else {
                const res = await axios.get(`http://localhost:8080/api/comment/projet/${projectId}`);
                setSelectedProjectComments(res.data);
                setSelectedPageComments(res.data.slice(0, cardsPerPage)); // Set comments for the current page
                setSelectedProjectId(projectId);
                setCurrentPage(0); // Reset the current page to 0
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


    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <MainCard title="All Comments">
                <Card
                    className="mt-5"
                    style={{
                        backgroundColor: "rgba(252,240,38,0.51)",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        position: "relative",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                    <strong>TO SHOW EACH PROJECT COMMENTS CLICK ON THE BUTTON BELOW</strong>
                </Card>
                {users.map((user) => (
                    <Panel key={user.id} header={`UserName: ${user.firstName}`} toggleable collapsed={true}
                           className="mt-5">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div style={{borderRadius: "10px", overflow: "hidden"}}>
                                    <DataTable ref={dt} value={user.projetList} tableStyle={{height: "5rem"}}>
                                        <Column field="id" sortable header="ID"></Column>
                                        <Column field="name" sortable filter header="Project Name"></Column>
                                        <Column header="Images" body={photoBodyTemplate}></Column>
                                        <Column
                                            header="Comments"
                                            body={(rowData) => (
                                                <div className="button-container">
                                                    <Button
                                                        onClick={() => handleProjectClick(rowData.id)}
                                                        className={`show-comments-button ${selectedProjectId === rowData.id ? 'active' : ''}`}
                                                    >
                                                        {selectedProjectId === rowData.id ? "Hide " : "Show "}
                                                    </Button>
                                                    <div className="guidance-circle"></div>
                                                </div>
                                            )}
                                        ></Column>

                                    </DataTable>
                                </div>
                            </Grid>
                            <Grid item xs={12} className="mt-5" >

                                <strong>Comments:</strong>
                                {user.projetList.map((project) => (
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
                                                        <Rating value={comment.rate} readOnly cancel={false} style={{ fontSize: '18px', marginTop: '10px' }} />
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
                        </Grid>
                    </Panel>
                ))}
            </MainCard>
        </>
    );
}