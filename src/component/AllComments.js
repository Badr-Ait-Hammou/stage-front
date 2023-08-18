import React, {useState, useEffect,useRef} from "react";
import MainCard from "../ui-component/cards/MainCard";
import axios from "../utils/axios";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from 'primereact/button';
import "../style/buttonGuide.css"
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import { Tag } from 'primereact/tag';
import {Link} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {Toolbar} from "primereact/toolbar";
import PopularCart from "../ui-component/cards/Skeleton/PopularCard";

export default function AllComments() {
    const [comment, setComment] = useState([]);
    const [selectedProjectComments, setSelectedProjectComments] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);

    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };


    useEffect(() => {
        loadComments();
        handleDataTableLoad();

    }, []);






    const loadComments = async () => {
        const res = await axios.get("/api/comment/all");
        setComment(res.data);
    };





    function formatDateTime(dateTime) {
        const dateObj = new Date(dateTime);
        const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
        return `${formattedDate} - ${formattedTime}`;
    }




    /******************************************************* Delete comment **************************************/

    const handleDeleteComment = (id) => {
        const confirmDelete = () => {
            axios.delete(`/api/comment/${id}`)
                .then(() => {
                    setComment(comment.filter((rowData) => rowData.id !== id));
                    toast.current.show({
                        severity: 'success',
                        summary: 'Done',
                        detail: 'Comment deleted successfully',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.error('Error deleting project:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'project assigned to an image or a comment', life: 3000});
                });
        };

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

                setSelectedProjectComments(updatedComments);

                toast.current.show({
                    severity: 'info',
                    summary: 'Done',
                    detail: 'Comment marked as read',
                    life: 3000
                });
                loadComments();
            })
            .catch((error) => {
                console.error(error);
            });
    };



    const statusBodyTemplate = (comment) => {
        return <Tag value={comment.status} severity={getSeverity(comment)}></Tag>;
    };

    const getSeverity = (comment) => {
        switch (comment.status) {
            case 'read':
                return 'success';

            case 'unread':
                return 'warning';

            default:
                return null;
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



    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    style={{ marginRight: '4px', padding: '8px', fontSize: '5px' }}
                    onClick={() => handleDeleteComment(rowData.id)}
                /> {!rowData.status || rowData.status === 'unread' ? (
                <Button
                    icon="pi pi-eye"
                    rounded
                    outlined
                    severity="success"
                    style={{ marginRight: '4px', padding: '8px', fontSize: '5px' }}
                    onClick={() => handleMarkAsRead(rowData.id)}
                /> ) : null}
            </React.Fragment>
        );
    };



    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />



            <MainCard>

                <Toolbar className="mb-4"  start={<strong>ALl Comments</strong>} end={rightToolbarTemplate}></Toolbar>
                {dataTableLoaded ? (
                <DataTable ref={dt} value={comment}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Comments" globalFilter={globalFilter} header={header}>
                    <Column field="id" header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                    <Column field="projet" header="Project Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '15rem' }}  body={(rowData) => (
                        <Link
                            className="font-bold"
                            to={rowData.projet.result && rowData.projet.result.type==="doc" ? `project_detailsDoc/${rowData.projet.id}` : rowData.projet.result && rowData.projet.result.type==="excel" ? `project_detailsExcel/${rowData.projet.id}` : `project_details/${rowData.projet.id}`}
                        >
                            {rowData.projet.name}
                        </Link>)}>
                    </Column>
                    <Column header="Client" field="user.firstName" filter filterPlaceholder="Search Client ..." sortable style={{ minWidth: '7rem' }} body={(rowData) => rowData.user?.firstName}></Column>
                    <Column field="commentDate" header="Comment_Date" filter sortable sortField="commentDate"      body={(rowData) => formatDateTime(rowData.commentDate)} style={{ minWidth: "12rem" }}></Column>
                    <Column field="note" header="Comment" filter sortable style={{ minWidth: '15rem' }} ></Column>
                    <Column field="status" header="Status" filter sortable  body={statusBodyTemplate} style={{ minWidth: '5rem' }} ></Column>
                    <Column  header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
                ) : (
                    <PopularCart/>
                )}

            </MainCard>

        </>
    );
}