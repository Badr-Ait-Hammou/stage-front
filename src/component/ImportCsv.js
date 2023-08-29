import MainCard from "../ui-component/cards/MainCard";
import {Typography} from "@mui/material";
import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FileUpload } from 'primereact/fileupload';


import CircularProgress from "@mui/material/CircularProgress";
import Pdftemplate from "../assets/images/pdftemplate7.png";
import Pdftemplate2 from "../assets/images/pdftemplate18.png";
import Pdftemplate3 from "../assets/images/pdftemplate21.png";
import Pdftemplate4 from "../assets/images/pdftemplatesimple11.png";
import Pdftemplate5 from "../assets/images/pdftemplatesimple12.png";
import Pdftemplate6 from "../assets/images/pdftemplate13.png";
import Pdftemplate7 from "../assets/images/pdftemplate19.png";
import Pdftemplate8 from "../assets/images/pdftemplate15.png";
import Pdftemplate9 from "../assets/images/pdftemplate16.png";
import {Toolbar} from "primereact/toolbar";
import {useEffect} from "react";
import axios from "../utils/axios";



export default function CSV(){
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [company, setCompany] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayDialog2, setDisplayDialog2] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [displayProgressBar, setDisplayProgressBar] = useState(false);
    const [progress, setProgress] = React.useState(10);



    useEffect(() => {
        axios.get(`/api/company/getfirst`).then((response) => {
            const companyData = response.data;
            setCompany(companyData);
        });
    }, []);

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

    const preloadImages = () => {
        images.forEach((image) => {
            const img = new Image();
            img.src = image.src;
        });
    };

    const handleFileUpload = (event) => {
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

            const rows = contents.split('\n');
            const parsedData = rows.map((row) => row.split(','));

            console.log("parsedData", parsedData);

            setData(parsedData);

            if (parsedData.length > 0) {
                const firstRow = parsedData[0];
                const dynamicColumns = firstRow.map((column, index) => ({
                    field: `column_${index}`,
                    header: column.replace(/"/g, ''),
                }));
                dynamicColumns.pop();
                setColumns(dynamicColumns);
            }

            setDisplayDialog2(false);
        };

        reader.readAsText(file);
    };




    const rightToolbarTemplate = () => {
        return (
            <div>
                <Button label="Import CSV Data" icon="pi pi-download" className="p-button-help" style={{marginRight:"5px"}} onClick={() => setDisplayDialog2(true)} />
                <Button label="Export PDF" icon="pi pi-file-pdf" className="p-button-danger "  onClick={showImageSelectionDialog} />
            </div>
        );
    };


    const processedData = data.slice(1).map((row, rowIndex) => {
        const rowData = {};
        row.forEach((cellValue, columnIndex) => {
            const fieldName = `column_${columnIndex}`;
            rowData[fieldName] = cellValue.replace(/"/g, ''); // Remove double quotes
        });
        return rowData;
    });

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


            const columnHeaders = columns.map((col) => col.header);

            const rows = processedData.map((rowData) => columns.map((col) => rowData[col.field]));



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
                    head: [columnHeaders], // Use columnHeaders as the header
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


            doc.save('datatable-export.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showUndefined();
        }
    };


    return (
        <>
            <MainCard>
                <div className="card">
                    <Toolbar className="mb-2"  start={<strong>Import Csv</strong>} end={rightToolbarTemplate}/>
                    <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <DataTable
                    value={data.slice(1).map((row, rowIndex) => {
                        const rowData = {};
                        row.forEach((cellValue, columnIndex) => {
                            const fieldName = `column_${columnIndex}`;
                            rowData[fieldName] = cellValue.replace(/"/g, ''); // Remove double quotes
                        });
                        return rowData;
                    })}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Image and Template projects"
                >
                    {columns.map((col, columnIndex) => (
                        <Column key={col.field} field={col.field} header={col.header} />
                    ))}
                </DataTable>
                    </div>
                </div>
            </MainCard>

                <Dialog
                visible={displayDialog2}
                onHide={() => setDisplayDialog2(false)}
                header="Upload CSV Data"
            >

                    <FileUpload
                        className="mt-2"
                        name="photo"
                        url={'/api/upload'}
                        accept=".csv"
                        maxFileSize={1000000}
                        emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                        chooseLabel="Select Csv File"
                        uploadLabel="Upload"
                        cancelLabel="Cancel"
                        onSelect={(e) => handleFileUpload(e)}
                    />
            </Dialog>





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

        </>
    );
};