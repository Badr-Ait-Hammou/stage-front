import React, { useEffect, useState,useRef } from "react";
import MainCard from "../ui-component/cards/MainCard";
import axios from "../utils/axios";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import PopulrCart from "../ui-component/cards/Skeleton/PopularCard"
import EmptyImg from "../assets/images/empty.png";
import "../style/Image.css"
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { auth } from '../routes/auth';



export default function ProjectPage() {

    const [client, setClient] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const [id, setId] = useState(parseInt(auth.getTokenInfo().sub));
    useEffect(() => {
        console.log(id);
        axios.get(`/api/users/${id}`).then((response) => {
            setClient(response.data);
        });
    }, [id]);


    const exportCSV = () => {
        dt.current.exportCSV();
    };



    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const leftToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 font-bold">Hello {client && client.firstName}</h4>
        </div>;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const imageTemplate = (rowData) => {
        if (rowData.images && rowData.images.length > 0 ) {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', justifyContent: 'center' }}>
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
            return <img src={EmptyImg} alt="No" style={{ width: '50px', height: 'auto' }} />;
        }
    };
    const resultFileBodyTemplate = (rowData) => {
        if (rowData.result && rowData.result.file) {
            return (
                <a href={rowData.result.file} download>
                    <FileDownloadIcon /> Download
                </a>
            );
        }
        return null;
    };
    return (
        <>
        <MainCard>
            <div className="card mb-2">
                <Toolbar className="mb-4" start={leftToolbarTemplate}  end={rightToolbarTemplate}></Toolbar>
                <div style={{ borderRadius: "10px", overflow: "hidden" }}>
                    { client && client.projetList && client.projetList.length > 0 ? (
                        <DataTable value={ client.projetList.filter(project => project.images && project.images.length > 0)} ref={dt}
                                   dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Image Projects" globalFilter={globalFilter} header={header}>
                            <Column field="name" header="Project Name" sortable filter filterPlaceholder="Search Name ..."  style={{ minWidth: '10rem' }}  body={(rowData) => (
                                <Link className="font-bold" to={`project_comment/${rowData.id}`}>{rowData.name}</Link>
                            )}></Column>
                            <Column field="description" header="Description " sortable filter style={{ minWidth: '11rem' }} />
                            <Column header="Images" body={imageTemplate} style={{ minWidth: '18rem' }}/>
                        </DataTable>
                    ) : (
                        <PopulrCart/>
                    )}
                </div>



            </div>
        </MainCard>

            <div className="mt-5">
            <MainCard>
                <div style={{ borderRadius: "10px", overflow: "hidden" }} className="mt-2">
                    {client && client.projetList && client.projetList.length > 0 ? (

                        <DataTable value={ client.projetList && client.projetList.filter(project => project.result)} tableStyle={{ minWidth: '30rem' }}  dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Template Projects" globalFilter={globalFilter} header={header}>
                            <Column field="name" header="Project Name" sortable filter style={{ minWidth: '10rem' }} body={(rowData) => (
                                <Link className="font-bold" to={`project_comment/${rowData.id}`}>{rowData.name}</Link>
                            )}></Column>
                            <Column header="Template Description" body={(rowData) => rowData.result && rowData.result.description} style={{ minWidth: '11rem' }} />
                            <Column header="Type" body={(rowData) => rowData.result && rowData.result.type} style={{ minWidth: '11rem' }} />

                            <Column header="Template File" body={resultFileBodyTemplate} style={{ minWidth: '10rem' }} />
                            <Column header="Template Name" body={(rowData) => rowData.result && rowData.result.name} style={{ minWidth: '11rem' }} />
                        </DataTable>
                    ) : (
                        <PopulrCart/>
                    )}
                </div>


            </MainCard>
            </div>
        </>
    );
}
