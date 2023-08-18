import "../style/project_details.css"
import React, {useState, useEffect,useRef} from 'react';
import {Toolbar} from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import axios from "../utils/axios";
import MainCard from "../ui-component/cards/MainCard";
import {useParams} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import Card from '@mui/material/Card';
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import { Tag } from 'primereact/tag';
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function ProjectComment() {
    const [project, setProject] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [commentDialog, setCommentDialog] = useState(false);
    const [editCommentDialog, seteditCommentDialog] = useState(false);
    const [rate, setRating] = useState(null);
    const [note,setNote]=useState();
    const [status,setStatus]=useState();
    const toast = useRef(null);
    const {id} = useParams();


    useEffect(() => {
        axios.get(`/api/projet/${id}`).then((response) => {
            setProject(response.data);
        });
    }, []);

    const loadComments=async ()=>{
        const res=await axios.get(`/api/projet/${id}`);
        setProject(res.data);
    }

    /******************************************************* Date format **************************************/

    function formatDateTime(dateTime) {
        const dateObj = new Date(dateTime);
        const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
        return `${formattedDate} - ${formattedTime}`;
    }

    /******************************************************* Save comment **************************************/

    const handleSubmit = (event) => {
        event.preventDefault();

        if (note.trim() === '' || rate === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please provide both note and rating.', life: 3000 });
            return;
        }


        axios.post("/api/comment/save", {
            note,
            rate ,
            status:"unread",
            projet:{
                id: project.id
            },
            user: {
                id: project.user.id,
                role:"CLIENT"
            },
        })
            .then((response) => {
                console.log("API Response:", response.data);
                setNote("");
                setRating("");
                toast.current.show({ severity: 'success', summary: 'Done', detail: 'your comment has been submitted successfully.', life: 3000 });
                loadComments();
                hideDialog();
            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };

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
                    loadComments();

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

    /******************************************************* dialog open/close **************************************/

    const openNew = () => {
        setNote("");
        setRating("");
        setCommentDialog(true);
    };

    const hideDialog = () => {
        setCommentDialog(false);
    };
    const hideeditDialog = () => {
        seteditCommentDialog(false);
    };




    /******************************************************* Update comment **************************************/

    useEffect(() => {
        if (selectedComment !== null) {
            const selectedCommentData = project.commentList.find((comment) => comment.id === selectedComment);
            if (selectedCommentData) {
                setNote(selectedCommentData.note);
                setRating(selectedCommentData.rate);
                setStatus(selectedCommentData.status)
            }
        } else {
            setNote("");
            setRating(null);
        }
    }, [selectedComment, project.commentList]);


    const handleupdate = (commentId) => {
        setSelectedComment(commentId);
        setNote("");
        setRating(null);
        setStatus("unread");
        seteditCommentDialog(true);
    };



    const handleEdit = async () => {
        if (note.trim() === '' ) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please provide both note and rating.', life: 3000 });
            return;
        }

        try {
            const response = await axios.put(`/api/comment/${selectedComment}`, {
                note: note,
                rate: rate,
                status:"unread",
            });

            const updatedComments = project.commentList.map((comment) =>
                comment.id === selectedComment ? response.data : comment
            );
            setProject({ ...project, commentList: updatedComments });
            toast.current.show({
                severity: 'info',
                summary: 'Done',
                detail: 'Comment updated successfully',
                life: 3000
            });
            hideeditDialog();
            loadComments();
        } catch (error) {
            console.error(error);
        }
    };


    /******************************************************* DataTable components **************************************/



    const imageBodyTemplate = (photo) => {
        return <img className=" image-item-small " src={photo.photo} alt={photo.name}/>
    };

    const header = (
        <div className="mt-2 mb-2">
            <span className="text-xl text-900 font-bold">{project.name} Comments</span>
        </div>
    );
    const footer = (
        <div>
            <p>
                In total there {project.images && project.images.length === 1 ? "is" : "are"}{" "}
                {project.images ? project.images.length : 0}{" "}
                {project.images && project.images.length === 1 ? "image" : "images"} on the{" "}
                {project.name} project.
            </p>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button   label="Add Comment" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };
    const commentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button  label="save"
                     severity="success"
                     raised onClick={(e) => handleSubmit(e)}/>
        </React.Fragment>
    );

    const editcommentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideeditDialog} />
            <Button  label="Update"
                     severity="success"
                     raised onClick={(e) => handleEdit(e)}/>
        </React.Fragment>
    );



    const resultFileBodyTemplate = () => {
        if (project.result && project.result.file) {
            return (
                <a href={project.result.file} download>
                    <FileDownloadIcon /> Download
                </a>
            );
        }
        return null;
    };
    const footer2 = (
        <div >
            <p>
                In total there is 1 Template on the{" "}
                {project.name} project.
            </p>
        </div>
    );



    return (
        <>

            <Toast ref={toast} />
            <ConfirmDialog />

            {project.result ? (
                <MainCard>
                    <div className="card">
                        <Toolbar className="mb-2" end={leftToolbarTemplate} start={header}/>
                        <div style={{borderRadius: '10px', overflow: 'hidden'}}>
                            <DataTable value={[project.result]} footer={footer2} tableStyle={{minWidth: '30rem'}}>
                                <Column field="id" sortable header="ID"></Column>
                                <Column header="Result File" body={resultFileBodyTemplate}></Column>
                                <Column field="name" sortable filter header="Name"></Column>
                            </DataTable>
                        </div>
                    </div>
                </MainCard>
            ) : (
                <MainCard>
                    <div className="card">
                        <Toolbar className="mb-2" end={leftToolbarTemplate} start={header}/>
                        <div style={{borderRadius: '10px', overflow: 'hidden'}}>
                            <DataTable value={project.images} footer={footer} tableStyle={{minWidth: '30rem'}}>
                                <Column field="id" sortable header="ID"></Column>
                                <Column header="Images" body={imageBodyTemplate}></Column>
                                <Column field="name" sortable filter header="Name"></Column>
                            </DataTable>
                        </div>
                    </div>
                </MainCard>
            )}


            <MainCard className="mt-5" title="Comments">
                <div>
                    {project.commentList &&
                        project.commentList.map((comment) => (

                            <Card
                                className="mt-5"
                                style={{
                                    backgroundColor: 'rgb(236,230,245)',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    position: 'relative',
                                }}
                            >
                                {comment.status === 'read' && (
                                    <Tag value="Read" severity="success"></Tag>
                                )}
                                {comment.status === 'unread' && (
                                    <Tag value="Unread" severity="warning"></Tag>
                                )}
                                {/*<Rating
                                    value={comment.rate}
                                    readOnly
                                    cancel={false}
                                    style={{ fontSize: '18px', marginTop: '10px' }}
                                />*/}
                                <p style={{ fontSize: '25px', marginTop: '15px' }}>{comment.note}</p>
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
                                        icon="pi pi-pencil"
                                        rounded
                                        outlined
                                        style={{ marginRight: '4px', padding: '8px', fontSize: '12px' }}
                                        onClick={() => handleupdate(comment.id)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        rounded
                                        outlined
                                        severity="danger"
                                        style={{ padding: '8px', fontSize: '12px' }}
                                        onClick={() => handleDeleteComment(comment.id)}
                                    />

                                </div>
                            </Card>
                        ))}
                </div>
            </MainCard>

            <Dialog  visible={commentDialog}
                     style={{ width: '40rem' }}
                     breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                     header="Add Comment"
                     modal
                     className="p-fluid"
                     footer={commentDialogFooter}
                     onHide={hideDialog}
            >
                {/* <div className="card flex justify-content-center">
                    <Rating value={rate} onChange={(e) => setRating(e.value)} cancel={false} />
                </div>*/}
                <div className="field mt-2">
                    <label htmlFor="newcmt" className="font-bold">
                        Note
                    </label>
                    <InputTextarea style={{marginTop:"5px"}} id="newcmt" value={note} onChange={(e) => setNote(e.target.value)} required />
                </div>
            </Dialog>

            <Dialog  visible={editCommentDialog}
                     style={{ width: '40rem' }}
                     breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                     header="Edit Comment"
                     modal
                     className="p-fluid"
                     footer={editcommentDialogFooter}
                     onHide={hideeditDialog}
            >
                {/*<div className="card flex justify-content-center">
                    <Rating value={rate} onChange={(e) => setRating(e.value)} cancel={false} />
                </div>*/}
                <div className="field mt-2">
                    <label htmlFor="newcmt" className="font-bold">
                        Note
                    </label>
                    <InputTextarea style={{marginTop:"5px"}} id="newcmt" value={note} onChange={(e) => setNote(e.target.value)} required />
                </div>
            </Dialog>

        </>
    );
}
