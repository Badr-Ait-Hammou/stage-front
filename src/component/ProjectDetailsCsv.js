import "../style/project_details.css"
import React, { useState, useEffect,useRef } from 'react';
import { Toolbar } from 'primereact/toolbar';
import axios from "axios";
import MainCard from "../ui-component/cards/MainCard";
import { useParams} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import Card from "@mui/material/Card";
import {Button} from "primereact/button";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import {Tag} from "primereact/tag";
import { Paginator } from 'primereact/paginator';
import Doc from "../assets/images/doc.png";
import Csv from "../assets/images/csv.png";
import {InputText} from "primereact/inputtext";
import PopularCart from "../ui-component/cards/Skeleton/PopularCard"
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default function ProjectDetailsCsv() {
    const [project, setProject] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 3;
    const toast = useRef(null);
    const { id } = useParams();
    const dt = useRef(null);

    const [data, setData] = useState([{}]);
    const [savedFieldValues, setSavedFieldValues] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showSaveAllButton, setShowSaveAllButton] = useState(false);



    /******************************************** Load  *******************************************/



    const loadFields = async (projectId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/field/result/${projectId}`);
            const newData = [];

            for (let i = 0; i < res.data.length; i++) {
                const field = res.data[i];
                field.fieldValueList.forEach((value, index) => {
                    if (!newData[index]) {
                        newData[index] = {};
                    }
                    newData[index][field.namef.toLowerCase()] = value.value;
                });
            }

            setData(newData);
        } catch (error) {
            console.error("Error loading fields:", error);
        }
    };



    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/api/projet/${id}`).then((response) => {
                setProject(response.data);
                if (response.data.result && response.data.result.id) {
                    loadFields(response.data.result.id);
                }
            });
        }
    }, [id]);

    if (!project.commentList) {
        return <PopularCart/>;
    }

    const loadComments=async ()=>{
        const res=await axios.get(`http://localhost:8080/api/projet/${id}`);
        setProject(res.data);
    }







    /******************************************** Add Datatable Row  *******************************************/



    const handleAddRow = () => {

        const newRow = {};
        project.result.fieldList.forEach((field) => {
            newRow[field.namef.toLowerCase()] = '';
        });
        const newData = [...data, newRow];
        setData(newData);
        setShowSaveAllButton(true); // Show the "Save All" button for the newly added row

    };

    /******************************************** Save all row values *******************************************/


    const handleSaveAll = () => {
        const lastRowValues = data[data.length - 1];

        const hasEmptyFields = Object.values(lastRowValues).some((value) => value === '');

        if (hasEmptyFields) {
            console.log("Cannot save due to empty fields.");
            showEmpty();
            return;
        }

        const savePromises = project.result.fieldList.map((field) =>
            axios.post("http://localhost:8080/api/fieldvalue/save", {
                value: lastRowValues[field.namef.toLowerCase()],
                field: {
                    id: field.id,
                },
            })
        );

        Promise.all(savePromises)
            .then((responses) => {
                console.log("Saved all field values:", responses);
                const newRow = {};
                project.result.fieldList.forEach((field) => {
                    newRow[field.namef.toLowerCase()] = '';
                });
                const newData = [...data];
                newData[newData.length - 1] = newRow;
                setData(newData);
                loadFields(project.result.id);
                setShowSaveAllButton(false);
                showusave();



            })
            .catch((error) => {
                console.error("Error while saving field values:", error);
                // Handle error
            });
    };


    /******************************************** Delete all row values *******************************************/


    const handleDeleteRow = async (rowData) => {
        if (!rowData) {
            console.error("Row data not found for deletion");
            return;
        }

        const confirmDelete = async () => {
            try {
                for (const field of project.result.fieldList) {
                    const fieldValue = rowData[field.namef.toLowerCase()];
                    if (fieldValue !== undefined) {
                        const fieldValueId = field.fieldValueList.find(
                            (value) => value.value === fieldValue
                        )?.id;

                        if (fieldValueId) {
                            await axios.delete(`http://localhost:8080/api/fieldvalue/${fieldValueId}`);
                        }
                    }
                }

                const updatedData = data.filter((row) => row !== rowData);
                setData(updatedData);
                showDelete();
                console.log("Deleted all values for row:", rowData);
            } catch (error) {
                console.error("Error deleting row values:", error);
            }
        };

        confirmDialog({
            message: 'Are you sure you want to delete this row?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete,
        });
    };


    /******************************************** Datatable component *******************************************/


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button   label="New" icon="pi pi-plus" severity="success" onClick={handleAddRow} />
            </div>
        );
    };


    const actionBodyTemplate = (rowData, rowIndex) => {
        return (
            <React.Fragment>
                {showSaveAllButton && rowIndex === data.length - 1 && (
                    <Button
                        icon="pi pi-check"
                        rounded
                        outlined
                        style={{ marginRight: '4px' }}
                        onClick={handleSaveAll}
                    />
                )}
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => handleDeleteRow(rowData)}
                />
            </React.Fragment>
        );
    };

    const footer = (
        <div >
            <p>
                In total there is 1 Template on the{" "}
                {project.name} project.
            </p>
        </div>
    );




    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."
                />
            </span>
        </div>
    );

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const rightToolbarTemplate = () => {
        return (
            <div>
        <Button label="Export" icon="pi pi-upload" className="p-button-help" style={{marginRight:"5px"}} onClick={exportCSV} />
        <Button label="Export PDF" icon="pi pi-file-pdf" className="p-button-danger "  onClick={handleExportPDF} />
        </div>
        );
    };




    /****************************************************** Toasts ****************************************/

    const showusave = () => {
        toast.current.show({severity:'success', summary: 'success', detail:'row saved successfully', life: 3000});
    }

    const showDelete = () => {
        toast.current.show({severity:'error', summary: 'done', detail:'row deleted successfully', life: 3000});
    }
    const showEmpty = () => {
        toast.current.show({severity:'warn', summary: 'heads up', detail:'the values are empty', life: 3000});
    }


    /****************************************************** InputChange ****************************************/



    const handleInputChange = (rowData, fieldId, value) => {
        const existingSavedValueIndex = savedFieldValues.findIndex(
            (savedValue) => savedValue.field.id === fieldId
        );

        if (existingSavedValueIndex !== -1) {
            savedFieldValues[existingSavedValueIndex].value = value;
            setSavedFieldValues([...savedFieldValues]);
        } else {
            const newSavedValue = {
                field: { id: fieldId },
                value: value,
            };
            setSavedFieldValues([...savedFieldValues, newSavedValue]);
        }

        const updatedRowData = { ...rowData, [fieldId]: value }; // Create a new object with the updated value
        const updatedData = data.map((row, index) => (index === data.indexOf(rowData) ? updatedRowData : row)); // Update the corresponding row in the data array
        setData(updatedData);
    };






    /************************************************* Comment Paginator *****************************************/

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
        if (project.result && project.result.file && project.result.type ==="doc") {
            return (
                <a href={project.result.file} download>

                    <img  src={Doc} alt="Download Icon" style={{ width: '30px', height: 'auto' }}/>
                </a>
            )

        }else{
            return(
                <a href={project.result.file} download>

                    <img  src={Csv} alt="Download Icon" style={{ width: '30px', height: 'auto' }}/>
                </a>
            )
        }

    };


    /******************************************** Export pdf *******************************************/



    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text('DataTable Export', 15, 15);

        // DataTable content
        const columns = project.result.fieldList.map((field) => field.namef);
        const rows = data.map((rowData) => project.result.fieldList.map((field) => rowData[field.namef.toLowerCase()]));

        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 30,
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 0; i < pageCount; i++) {
            doc.setPage(i);
            doc.text(`Page ${i + 1} of ${pageCount}`, 15, doc.internal.pageSize.height - 10);
        }

        // Save the PDF
        doc.save('datatable-export.pdf');
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
                            <Column header="Template File" body={resultFileBodyTemplate} style={{ minWidth: '12rem' }} />
                            <Column field="description" header="Description"></Column>
                            <Column field="type" header="Type"></Column>
                        </DataTable>
                    </div>
                </div>
            </MainCard>



            <div className="mt-5">
                <MainCard>
                    <Toolbar className="mb-2"  center={<strong>Manage Csv</strong>} start={leftToolbarTemplate} end={rightToolbarTemplate} />


                    <DataTable
                        ref={dt}
                        value={data}
                        dataKey={(rowData, index) => index}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Images" globalFilter={globalFilter}  header={header}
                    >


                        {project.result.fieldList.map((field) => (
                            <Column

                                key={`input-${field.id}`}

                                header={field.namef}
                                field={field.namef.toLowerCase()}
                                style={{ minWidth: '7rem' }}
                                body={(rowData) => (
                                    <InputText
                                        style={{
                                            border: 'none',
                                            background: 'none',
                                            outline: 'none',
                                            boxShadow: 'none',
                                            fontSize: 'inherit',
                                            color: 'inherit',
                                            width: '100%',
                                            textAlign: 'left',
                                        }}
                                        type="text"
                                        //key={`input-${field.id}-${rowData.id}`} // Unique key for each input
                                        value={rowData[field.namef.toLowerCase()]}
                                        onChange={(e) =>
                                            handleInputChange(rowData, field.namef.toLowerCase(), e.target.value)
                                        }
                                    />
                                )}

                            />
                        ))}
                        <Column
                            key="save"
                            header="Action"
                            body={(rowData) => actionBodyTemplate(rowData, data.indexOf(rowData))}
                            style={{ minWidth: '12rem' }}
                        />


                    </DataTable>
                </MainCard>
            </div>

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