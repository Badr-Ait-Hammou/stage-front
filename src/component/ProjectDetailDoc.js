import "../style/project_details.css"
import React, { useState, useEffect,useRef } from 'react';
import { Toolbar } from 'primereact/toolbar';
import axios from "axios";
import MainCard from "../ui-component/cards/MainCard";
import {useParams} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import Card from "@mui/material/Card";
import {Rating} from "primereact/rating";
import {Button} from "primereact/button";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import {Tag} from "primereact/tag";
import { Paginator } from 'primereact/paginator';
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function ProjectDetailDoc() {
    const [project, setProject] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 3;
    const toast = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projet/${id}`).then((response) => {
            setProject(response.data);
        });
    }, [id]);

    if (!project.commentList) {
        return <div>Loading...</div>;
    }

    const loadComments=async ()=>{
        const res=await axios.get(`http://localhost:8080/api/projet/${id}`);
        setProject(res.data);
    }




    const header = (
        <div className="mt-2 mb-2">
            <span className="text-xl text-900 font-bold">{project.name} Images</span>
        </div>
    );
    const footer = (
        <div >
            <p>
                In total there is 1 Template on the{" "}
                {project.name} project.
            </p>
        </div>
    );




    /************************************* Paginator **************************************/

    const handlePageChange = (event) => {
        setCurrentPage(event.page);
    };

    const displayComments = project.commentList
        .slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)
        .map((comment) => (
            <Card
                key={comment.id}
                className="mt-5"
                style={{
                    backgroundColor: 'rgb(236, 230, 245)',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
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
        ));
    /************************************* Date format **************************************/

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
    /******************************************************* Mark as Read  **************************************/


    const handleMarkAsRead = (commentId) => {
        axios.put(`http://localhost:8080/api/comment/read/${commentId}`, {
            status: "read",
        })
            .then(() => {
                const updatedComments = project.commentList.map((comment) =>
                    comment.id === commentId ? { ...comment, status: "read" } : comment
                );
                setProject({ ...project, commentList: updatedComments });
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

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <MainCard>
                <div className="card">
                    <Toolbar className="mb-2"  center={header}/>
                    <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <DataTable value={[project.result]} footer={footer} tableStyle={{ minWidth: '30rem' }}>

                            <Column field="id" header="ID"></Column>
                            <Column field="name" header="Name"></Column>
                            <Column header="Result File" body={resultFileBodyTemplate} style={{ minWidth: '12rem' }} />
                            <Column field="description" header="Description"></Column>
                            <Column field="type" header="Type"></Column>
                        </DataTable>
                    </div>
                </div>
            </MainCard>

            <MainCard className="mt-5" title="Comments">
                {project.commentList.length > 0 ? (
                    <div>
                        {displayComments}
                        <Paginator
                            first={currentPage * cardsPerPage}
                            rows={cardsPerPage}
                            totalRecords={project.commentList.length}
                            onPageChange={handlePageChange}
                        />
                    </div>
                ) : (
                    <div className="text-center">
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
                    </div>
                )}
            </MainCard>

        </>
    );
}
