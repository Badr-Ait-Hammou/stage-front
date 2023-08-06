import "../style/project_details.css"
import React, {useState, useEffect,useRef} from 'react';
import {Toolbar} from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import axios from "axios";
import MainCard from "../ui-component/cards/MainCard";
import {useParams} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import {Button} from "primereact/button";
import Card from '@mui/material/Card';

export default function ProjectComment() {
    const [project, setProject] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [commentDialog, setCommentDialog] = useState(false);
    const [editCommentDialog, seteditCommentDialog] = useState(false);
    const [rate, setRating] = useState(null);
    const [note,setNote]=useState();
    const toast = useRef(null);
    const {id} = useParams();


    useEffect(() => {
        axios.get(`http://localhost:8080/api/projet/${id}`).then((response) => {
            setProject(response.data);
        });
    }, []);

    const loadComments=async ()=>{
        const res=await axios.get(`http://localhost:8080/api/projet/${id}`);
        setProject(res.data);
    }



    const handleSubmit = (event) => {
        event.preventDefault();

        if (note.trim() === '' || rate === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please provide both note and rating.', life: 3000 });
            return;
        }


        axios.post("http://localhost:8080/api/comment/save", {
            note,
            rate,
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
                loadComments();
                hideDialog();
            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };

    const handleDeleteComment = (commentId) => {
        axios.delete(`http://localhost:8080/api/comment/${commentId}`)
            .then((response) => {
                console.log("Comment deleted:", response.data);
                loadComments();
            })
            .catch((error) => {
                console.error("Error while deleting comment:", error);
            });
    };


    useEffect(() => {
        if (selectedComment !== null) {
            const selectedCommentData = project.commentList.find((comment) => comment.id === selectedComment);
            if (selectedCommentData) {
                setNote(selectedCommentData.note);
                setRating(selectedCommentData.rate);
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
        seteditCommentDialog(true);
    };

    const handleEdit = async () => {
        if (note.trim() === '' || rate === null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please provide both note and rating.', life: 3000 });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/comment/${selectedComment}`, {
                note: note,
                rate: rate,
            });

            const updatedComments = project.commentList.map((comment) =>
                comment.id === selectedComment ? response.data : comment
            );
            setProject({ ...project, commentList: updatedComments });

            hideeditDialog();
            loadComments();
        } catch (error) {
            console.error(error);
        }
    };





    const imageBodyTemplate = (photo) => {
        return <img className=" image-item-small " src={photo.photo} alt={photo.name}/>
    };

    const header = (
        <div className="mt-2 mb-2">
            <span className="text-xl text-900 font-bold">{project.name} Comment</span>
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
            <Button  label="save"
                     severity="success"
                     raised onClick={(e) => handleEdit(e)}/>
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />
            <MainCard>
                <div className="card">
                    <Toolbar className="mb-2" start={leftToolbarTemplate} center={header}/>
                    <div style={{borderRadius: '10px', overflow: 'hidden'}}>
                        <DataTable value={project.images} footer={footer} tableStyle={{minWidth: '30rem'}}>
                            <Column field="id" sortable header="ID"></Column>
                            <Column header="Images" body={imageBodyTemplate}></Column>
                            <Column field="name" sortable filter header="Name"></Column>
                        </DataTable>
                    </div>
                </div>
            </MainCard>

            <MainCard className="mt-5" >
                <div>
                    {project.commentList &&
                        project.commentList.map((comment) => (
                            <Card
                                className="mt-5"
                                style={{
                                    backgroundColor: 'rgba(142,154,246,0.53)',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    position: 'relative', // Add position relative to the card container
                                }}
                            >
                                <Rating value={comment.rate} readOnly cancel={false} />
                                <p style={{ fontSize: '18px', marginBottom: '10px' }}>{comment.note}</p>
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
                <div className="card flex justify-content-center">
                    <Rating value={rate} onChange={(e) => setRating(e.value)} cancel={false} />
                </div>
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
                     header="Add Comment"
                     modal
                     className="p-fluid"
                     footer={editcommentDialogFooter}
                     onHide={hideeditDialog}
            >
                <div className="card flex justify-content-center">
                    <Rating value={rate} onChange={(e) => setRating(e.value)} cancel={false} />
                </div>
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
