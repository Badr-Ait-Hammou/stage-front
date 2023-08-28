import "../style/project_details.css"
import React, { useState, useEffect,useRef } from 'react';
import { Toolbar } from 'primereact/toolbar';
import axios from "../utils/axios";
import MainCard from "../ui-component/cards/MainCard";
import { useParams} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import Card from "@mui/material/Card";
import {Button} from "primereact/button";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import {Tag} from "primereact/tag";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';

import * as XLSX from 'xlsx/xlsx.mjs';

import { Paginator } from 'primereact/paginator';
import Doc from "../assets/images/doc.png";
import Csv from "../assets/images/csv.png";
import {InputText} from "primereact/inputtext";
import PopularCart from "../ui-component/cards/Skeleton/PopularCard"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Dialog } from "primereact/dialog";
import Pdftemplate from "../assets/images/pdftemplate7.png"
import Pdftemplate2 from "../assets/images/pdftemplate18.png"
import Pdftemplate3 from "../assets/images/pdftemplate21.png"
import Pdftemplate4 from "../assets/images/pdftemplatesimple11.png"
import Pdftemplate5 from "../assets/images/pdftemplatesimple12.png"
import Pdftemplate6 from "../assets/images/pdftemplate13.png"
import Pdftemplate7 from "../assets/images/pdftemplate19.png"
import Pdftemplate8 from "../assets/images/pdftemplate15.png"
import Pdftemplate9 from "../assets/images/pdftemplate16.png"
import {FileUpload} from "primereact/fileupload";


export default function ProjectDetailsCsv() {
    const [project, setProject] = useState([]);
    const [company, setCompany] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 3;
    const toast = useRef(null);
    const { id } = useParams();
    const dt = useRef(null);
    const [data, setData] = useState([{}]);
    const [savedFieldValues, setSavedFieldValues] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showSaveAllButton, setShowSaveAllButton] = useState(false);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [displayProgressBar, setDisplayProgressBar] = useState(false);
    const [progress, setProgress] = React.useState(10);
    const [displayDialog2, setDisplayDialog2] = useState(false);


    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 20));
        }, 500);
        return () => {
            clearInterval(timer);
        };
    }, []);





    const showImageSelectionDialog = () => {
        preloadImages();
        setDisplayDialog(true);
    };

    const hideImageSelectionDialog = () => {
        setDisplayDialog(false);
    };

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const confirmImageSelection = async () => {
        hideImageSelectionDialog();
        if (selectedImage) {
            setDisplayProgressBar(true);
            setProgress(0);
            await handleExportPDF(selectedImage);
            setProgress(100);
            setDisplayProgressBar(false);
        }
    };



    const images = [
        { id: 1, src: Pdftemplate },
        { id: 2, src: Pdftemplate2 },
        { id: 3, src: Pdftemplate3 },
        { id: 4, src: Pdftemplate4 },
        { id: 5, src: Pdftemplate5 },
        { id: 6, src: Pdftemplate6 },
        { id: 7, src: Pdftemplate7 },
        { id: 8, src: Pdftemplate8 },
        { id: 9, src: Pdftemplate9 },
    ];

    /******************************************** Load  *******************************************/


    const preloadImages = () => {
        images.forEach((image) => {
            const img = new Image();
            img.src = image.src;
        });
    };

    const loadFields = async (projectId) => {
        try {
            const res = await axios.get(`/api/field/result/${projectId}`);
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
           // handleAddRow();
        } catch (error) {
            console.error("Error loading fields:", error);
        }
    };



    useEffect(() => {
        if (id) {
            axios.get(`/api/projet/${id}`).then((response) => {
                setProject(response.data);
                if (response.data.result && response.data.result.id) {
                    loadFields(response.data.result.id);
                }
            });
        }
        axios.get(`/api/company/getfirst`).then((response) => {
            const companyData = response.data;
            setCompany(companyData);
        });
    }, [id]);

    if (!project.commentList) {
        return <PopularCart/>;
    }

    const loadComments=async ()=>{
        const res=await axios.get(`/api/projet/${id}`);
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
        setShowSaveAllButton(true);

    };


    /******************************************** Save all row values *******************************************/


    const handleSaveAll = () => {
        const savePromises = data.map((rowData) => {
            const savePromisesForRow = project.result.fieldList.map((field) =>
                axios.post("/api/fieldvalue/save", {
                    value: rowData[field.namef.toLowerCase()],
                    field: {
                        id: field.id,
                    },
                })
            );
            return Promise.all(savePromisesForRow);
        });

        Promise.all(savePromises)
            .then((responses) => {
                console.log("Saved all field values for imported data:", responses);
                const newEmptyRow = {};
                project.result.fieldList.forEach((field) => {
                    newEmptyRow[field.namef.toLowerCase()] = '';
                });
                setData([...data, newEmptyRow]);
                setSavedFieldValues([]);
                showusave();
            })
            .catch((error) => {
                console.error("Error while saving field values:", error);
            });
    };


    const saveSingleRow = (rowData) => {
        console.log("rowData:", rowData); // Debugging line

        const savePromisesForRow = project.result.fieldList.map((field, index) =>
            axios.post("/api/fieldvalue/save", {
                value: rowData[field.namef.toLowerCase()],
                field: {
                    id: field.id,
                },
            })
        );

        console.log("savePromisesForRow:", savePromisesForRow); // Debugging line

        Promise.all(savePromisesForRow)
            .then((responses) => {
                console.log("Saved field values for the single row:", responses);
                setShowSaveAllButton(false);
                showusave();
            })
            .catch((error) => {
                console.error("Error while saving field values:", error);
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
                            await axios.delete(`/api/fieldvalue/${fieldValueId}`);
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
                        onClick={() => saveSingleRow(rowData)}
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
        <Button label="Export PDF" icon="pi pi-file-pdf" className="p-button-danger "  onClick={showImageSelectionDialog} />
        <Button label="Import CSV Data"  icon="pi pi-file-excel" className="p-button-secondary" style={{marginLeft:"5px"}} onClick={() => setDisplayDialog2(true)} />

            </div>
        );
    };




    /****************************************************** Toasts ****************************************/

    const showusave = () => {
        toast.current.show({severity:'success', summary: 'success', detail:'row saved successfully', life: 3000});
    }
    const showusaveCsv = () => {
        toast.current.show({severity:'success', summary: 'success', detail:'Csv Data saved successfully', life: 3000});
    }

    const showDelete = () => {
        toast.current.show({severity:'error', summary: 'done', detail:'row deleted successfully', life: 3000});
    }
    const showEmpty = () => {
        toast.current.show({severity:'warn', summary: 'heads up', detail:'the values are empty', life: 3000});
    }
    const showUndefined  = () => {
        toast.current.show({severity:'error', summary: 'Undefined', detail:'There is no infos about the company', life: 3000});
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

        const updatedRowData = { ...rowData, [fieldId]: value };
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
                <div style={{ display: 'flex', alignItems: 'center',marginTop: '10px' }}>
                    <Avatar>
                        <Typography
                            variant="h4"
                            style={{
                                fontWeight: 'bold',
                                color: 'white'
                            }}
                        >
                        {`${project.user.firstName.charAt(0).toUpperCase()}${project.user.lastName.charAt(0).toUpperCase()}`}
                        </Typography>
                        </Avatar>
                <p style={{ fontSize: '25px',marginLeft:"5px" }}>{comment.note}</p>
                </div>
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
    /******************************************************* Mark as Read  **************************************/


    const handleMarkAsRead = (commentId) => {
        axios.put(`/api/comment/read/${commentId}`, {
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

    const parseCSVContents = (contents) => {
        const rows = contents.split('\n');
        const parsedData = rows.map((row) => {
            const cells = row.split(',');
            return cells.map((cell) => (cell.startsWith('"') && cell.endsWith('"') ? cell.slice(1, -1) : cell));
        });
        console.log("parsed data", parsedData);

        return parsedData;
    };

    /*
    const handleImportCSV = (event) => {
        const selectedFiles = event.files;
        if (!selectedFiles || selectedFiles.length === 0) {
            console.error("No files selected");
            return;
        }

        const file = selectedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const contents = e.target.result;
            console.log("contents", contents);

            const parsedData = parseCSVContents(contents);

            if (parsedData && parsedData.length > 0) {
                const newData = [...data]; // Create a copy of the current data array
                const newSavedFieldValues = [...savedFieldValues]; // Create a copy of the current savedFieldValues array

                parsedData.forEach((rowData) => {
                    const newRow = {};
                    project.result.fieldList.forEach((field, index) => {
                        newRow[field.namef.toLowerCase()] = rowData[index];
                    });
                    newData.push(newRow); // Add the new row to the newData array

                    const savedFieldValuesForRow = project.result.fieldList.map((field, index) => ({
                        field: { id: field.id },
                        value: rowData[index],
                    }));
                    newSavedFieldValues.push(...savedFieldValuesForRow); // Add the savedFieldValues for the new row
                });

                setData(newData);
                setSavedFieldValues(newSavedFieldValues);
            } else {
                console.error("Parsed data is empty");
            }
        };

        reader.readAsText(file);
    };
*/

    /*
    const handleImportCSV = (event) => {
        const selectedFiles = event.files;
        if (!selectedFiles || selectedFiles.length === 0) {
            console.error("No files selected");
            return;
        }

        const file = selectedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const contents = e.target.result;
            console.log("contents", contents);

            const parsedData = parseCSVContents(contents);

            if (parsedData && parsedData.length > 1) {
                const newData = [...data];

                for (let i = 1; i < parsedData.length; i++) {
                    const rowData = parsedData[i];
                    const newRow = {};

                    project.result.fieldList.forEach((field, index) => {
                        newRow[field.namef.toLowerCase()] = rowData[index];
                    });

                    newData.push(newRow); // Add the new row to the newData array
                }

                setData(newData);

                // Save the parsedData (excluding the first row) to the database
                const savePromises = parsedData.slice(1).map((rowData) => {
                    const savePromisesForRow = project.result.fieldList.map((field, index) =>
                        axios.post("/api/fieldvalue/save", {
                            value: rowData[index],
                            field: {
                                id: field.id,
                            },
                        })
                    );
                    return Promise.all(savePromisesForRow);
                });

                Promise.all(savePromises)
                    .then((responses) => {
                        console.log("Saved all field values for imported data:", responses);
                        showusaveCsv();
                        setDisplayDialog2(false);
                    })
                    .catch((error) => {
                        console.error("Error while saving field values:", error);
                    });
            } else {
                console.error("Parsed data is empty");
            }
        };

        reader.readAsText(file);
    };

*/

    const handleImportCSV = (event) => {
        const selectedFiles = event.files;
        if (!selectedFiles || selectedFiles.length === 0) {
            console.error("No files selected");
            return;
        }

        const file = selectedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const contents = e.target.result;
            console.log("contents", contents);

            const workbook = XLSX.read(contents, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const parsedData = XLSX.utils.sheet_to_json(worksheet);

            if (parsedData && parsedData.length > 0) {
                const newData = [...data];

                parsedData.forEach((rowData) => {
                    const newRow = {};

                    project.result.fieldList.forEach((field, index) => {
                        newRow[field.namef.toLowerCase()] = rowData[field.namef];
                    });

                    newData.push(newRow);
                });

                setData(newData);


                const savePromises = parsedData.map((rowData) => {
                    const savePromisesForRow = project.result.fieldList.map((field, index) =>
                        axios.post("/api/fieldvalue/save", {
                            value: rowData[field.namef],
                            field: {
                                id: field.id,
                            },
                        })
                    );
                    return Promise.all(savePromisesForRow);
                });

                Promise.all(savePromises)
                    .then((responses) => {
                        console.log("Saved all field values for imported data:", responses);
                        showusaveCsv();
                        setDisplayDialog2(false);
                    })
                    .catch((error) => {
                        console.error("Error while saving field values:", error);
                    });
            } else {
                console.error("Parsed data is empty");
            }
        };

        reader.readAsArrayBuffer(file);
    };

    /******************************************** Export pdf *******************************************/



    const handleExportPDF = async (backgroundImage) => {
        try {
            console.log('Starting PDF generation...');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        doc.addImage(backgroundImage, 'JPEG', 0, 0, pageWidth, pageHeight);

        // Company Logo
        const imgData = company ? company.logo : "no logo";
        const logoWidth = 25;
        const logoHeight = 25;
        const logoX = 10;
        const logoY = 10;

        doc.addImage(imgData, 'JPEG', logoX, logoY, logoWidth, logoHeight);

        // Company Name
        const nameX = logoX + 6;
        const nameY = logoY + logoHeight + 4;
        doc.setFontSize(10);
        doc.text(company.name, nameX, nameY);

        const maxAddressLength = 30;

        const splitAddress = (address) => {
            const lines = [];
            let currentLine = '';

            for (let i = 0; i < address.length; i++) {
                currentLine += address[i];
                if (currentLine.length >= maxAddressLength || i === address.length - 1) {
                    lines.push(currentLine);
                    currentLine = '';
                }
            }
            return lines;
        };

        const contactInfoX = doc.internal.pageSize.width - 48;
        const contactInfoY = 16;

        const addressLines = splitAddress(company.address);

        const companyInfo = [
            `${company.phone}`,
            `${company.email}`,
            `${company.webSite}`,
            ...addressLines,

        ];

        const lineHeight = 6;
        const infoFontSize = 8;
        doc.setFontSize(infoFontSize);

        for (let j = 0; j < companyInfo.length; j++) {
            const lineY = contactInfoY + (lineHeight * j);
            doc.text(companyInfo[j], contactInfoX, lineY, {align: 'left'});
        }
        // Title
        doc.setFontSize(10);
        const titleX = doc.internal.pageSize.width / 2;
        doc.setFontSize(16);
        doc.text(` ${company.name} - Company`, titleX, 60, {align: 'center'});


        const currentDate = new Date();
        const dateTimeString = currentDate.toLocaleString();
        doc.setFontSize(8);
        doc.text(` ${dateTimeString}`, titleX, 65, {align: 'center'});


        const columns = project.result.fieldList.map((field) => field.namef);
        const rows = data.map((rowData) => project.result.fieldList.map((field) => rowData[field.namef.toLowerCase()]));

        const rowsPerPage = 15;
        const totalPageCount = Math.ceil(rows.length / rowsPerPage);

        let currentPage = 0;
        while (currentPage * rowsPerPage < rows.length) {
            if (currentPage > 0) {
                doc.addPage();
                doc.addImage(backgroundImage, 'JPEG', 0, 0, pageWidth, pageHeight); // Add background image
            }

            // Company Logo
            const imgData = company ? company.logo : "no logo";
            const logoWidth = 25;
            const logoHeight = 25;
            const logoX = 10;
            const logoY = 10;

            doc.addImage(imgData, 'JPEG', logoX, logoY, logoWidth, logoHeight);

            // Company Name
            const nameX = logoX + 6;
            const nameY = logoY + logoHeight + 4;
            doc.setFontSize(10);
            doc.text(company.name, nameX, nameY);

            const maxAddressLength = 30;

            const splitAddress = (address) => {
                const lines = [];
                let currentLine = '';

                for (let i = 0; i < address.length; i++) {
                    currentLine += address[i];
                    if (currentLine.length >= maxAddressLength || i === address.length - 1) {
                        lines.push(currentLine);
                        currentLine = '';
                    }
                }

                return lines;
            };

            const contactInfoX = doc.internal.pageSize.width - 48;
            const contactInfoY = 16;

            const addressLines = splitAddress(company.address);

            const companyInfo = [
                `${company.phone}`,
                `${company.email}`,
                `${company.webSite}`,
                ...addressLines,

            ];

            const lineHeight = 6;
            const infoFontSize = 8;
            doc.setFontSize(infoFontSize);

            for (let j = 0; j < companyInfo.length; j++) {
                const lineY = contactInfoY + (lineHeight * j);
                doc.text(companyInfo[j], contactInfoX, lineY, {align: 'left'});
            }
            // Title
            doc.setFontSize(10);
            const titleX = doc.internal.pageSize.width / 2;
            doc.setFontSize(16);
            doc.text(` ${company.name} - Company`, titleX, 60, {align: 'center'});


            const currentDate = new Date();
            const dateTimeString = currentDate.toLocaleString();
            doc.setFontSize(8);
            doc.text(` ${dateTimeString}`, titleX, 65, {align: 'center'});

            // Adding the table and other content
            const startRow = currentPage * rowsPerPage;
            const endRow = Math.min((currentPage + 1) * rowsPerPage, rows.length);


            doc.autoTable({
                head: [columns],
                body: rows.slice(startRow, endRow),
                startY: 80,
                theme: 'grid',
                styles: {
                    fontSize: 10,
                    halign: 'center',
                    valign: 'middle',
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [75, 76, 88],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                },
                columnStyles: {
                    cellWidth: 20,
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245],
                },
            });

            currentPage++;

        }


        for (let i = 0; i < totalPageCount; i++) {
            doc.setPage(i);
            const footerX = doc.internal.pageSize.width / 2;
            const footerY = doc.internal.pageSize.height - 10;
           // doc.text(`Page ${i + 1} of ${totalPageCount}`, footerX, footerY, { align: 'center' });

            const pageCompanyInfo = [
                    `EMAIL: ${company.email}   | R.C: ${company.valRc}  | WEBSITE :${company.webSite}`,
                    `CNSS: ${company.valCnss}   | I.C.E: ${company.valIce}  |  I.F: ${company.valIf} `,
                    `PHONE: ${company.phone}   | ADDRESS: ${company.address}  |  FAX: ${company.fax}`,
                ];

            const lineHeight = 5;
            const infoFontSize = 8;
            doc.setFontSize(infoFontSize);

            for (let j = 0; j < pageCompanyInfo.length; j++) {
                const lineY = footerY - (lineHeight * (j + 1));
                doc.text(pageCompanyInfo[j], footerX, lineY, { align: 'center' });
            }
        }

        // Save the PDF with the given name
        doc.save('datatable-export.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showUndefined();
        }
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
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Csv rows" globalFilter={globalFilter}  header={header}
                    >


                        {project.result.fieldList.map((field) => (
                            <Column
                                key={`input-${field.id}`}
                                header={field.namef}
                                field={field.namef.toLowerCase()} // Use the correct property name
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
                                        value={rowData[field.namef.toLowerCase()]} // Set the input value based on data property
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




            <Dialog visible={displayDialog} onHide={hideImageSelectionDialog}  style={{ width: '40rem' }}
                     header="Select a theme">
                <div  style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', justifyContent: 'center',marginTop:"20px",marginBottom:"20px" }}>
                    {images.map(image => (
                        <img
                            key={image.id}
                            src={image.src}
                            alt={`Image ${image.id}`}
                            style={{ width: '90%',height:"auto" }}
                            className={`image-item-small ${selectedImage === image.src ? "selected" : ""}`}
                            onClick={() => handleImageClick(image.src)}
                        />
                    ))}
                </div>
                <Button  label="Confirm" className="p-button-success mt-5" onClick={confirmImageSelection} />
            </Dialog>

            <Dialog visible={displayProgressBar} onHide={() => {}} closable={false} showHeader={false} style={{ width: '30rem', borderRadius: '10px' }} modal>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CircularProgress variant="determinate" value={progress} />
                    <Typography variant="body1">{`${Math.round(progress)}%`}</Typography>
                </div>
            </Dialog>


            <Dialog
                visible={displayDialog2}
                onHide={() => setDisplayDialog2(false)}
                header="Upload CSV Data"
            >

                <FileUpload
                    className="mt-2"
                    name="photo"
                    url={'/api/upload'}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    maxFileSize={1000000}
                    emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                    chooseLabel="Select Csv file"
                    uploadLabel="Upload"
                    cancelLabel="Cancel"
                    onSelect={(e) => handleImportCSV(e)} // Pass the event object here
                />
            </Dialog>



        </>
    );
}
