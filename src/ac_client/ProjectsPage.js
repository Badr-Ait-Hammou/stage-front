import React, { useEffect, useState,useRef } from "react";
import MainCard from "../ui-component/cards/MainCard";
import axios from "../utils/axios";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import "../style/Image.css"
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { auth } from '../routes/auth';
import PopularCart from "../ui-component/cards/Skeleton/PopularCard";
import Doc from "../assets/images/doc.png";
import Csv from "../assets/images/csv.png";
import { Tag } from 'primereact/tag';
import NoImg from "../assets/images/nopic.png";




export default function ProjectPage() {

    const [client, setClient] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);
    const [id, setId] = useState(parseInt(auth.getTokenInfo().sub));

    const definedNameProjects = client.projetList && Array.isArray(client.projetList)
        ? client.projetList.filter((project) => project.result && project.result.name !== "")
        : [];

    const undefinedNameProjects = client.projetList && Array.isArray(client.projetList)
        ? client.projetList.filter((project) => !project.result || project.result.name === "")
        : [];

    const sortedProjects = undefinedNameProjects.concat(definedNameProjects);



    useEffect(() => {
        console.log(id);
        axios.get(`/api/users/${id}`).then((response) => {
            setClient(response.data);
            handleDataTableLoad();
        });
    }, [id]);

    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };



    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const leftToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 font-bold">{client && client.username ? `Hello ${client.username.toUpperCase()}` : 'Hello Guest'}
            </h4>
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
            return <img src={NoImg} alt="No" style={{width: '30px', height: 'auto'}}/>;
        }
    };
    /*const resultFileBodyTemplate = (rowData) => {
        if (rowData.result && rowData.result.file) {
            return (
                <a href={rowData.result.file} download>
                    <FileDownloadIcon /> Download
                </a>
            );
        }
        return null;
    };
*/

    const resultFileBodyTemplate = (rowData) => {
        if (rowData.result && rowData.result.file) {
            let icon;

            if (rowData.result.type === 'doc') {
                icon = Doc;
            } else if (rowData.result.type === 'excel') {
                icon = Csv;
            } else {
                icon = <FileDownloadIcon />;
            }

            return (
                <a href={rowData.result.file} download>
                    <img  src={icon} alt="Download Icon" style={{ width: '30px', height: 'auto' }}/>

                </a>
            );
        } else {
            return             <Tag value="Not found" severity="warning" />
                ;
        }
    };

    function formatDateTime(dateTime) {
        const dateObj = new Date(dateTime);
        const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
        return `${formattedDate} - ${formattedTime}`;
    }



    return (
        <>
            <MainCard>
                <div className="card mb-2">
                    <Toolbar className="mb-4" start={leftToolbarTemplate}  end={rightToolbarTemplate}></Toolbar>
                    <div style={{ borderRadius: "10px", overflow: "hidden" }}>

                {dataTableLoaded ? (
                    <DataTable ref={dt} value={ sortedProjects}
                               dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Image and Template projects" globalFilter={globalFilter} header={header}>
                        <Column field="name" header="Project Name" filter filterPlaceholder="Search Name ..." sortable style={{ minWidth: '10rem' }}  body={(rowData) => (
                            <Link className="font-bold" to={`project_comment/${rowData.id}`}>{rowData.name}</Link>
                        )}></Column>
                        <Column field="description" header="Description" sortable style={{ minWidth: '15em' }}></Column>
                        <Column field="photo" header="Images" body={imageTemplate} sortable style={{ minWidth: '18rem' }} ></Column>
                        <Column field="result.file" header="file" filter body={resultFileBodyTemplate} sortable style={{ minWidth: '10rem' }} ></Column>
                        <Column header="Template Name"  body={(rowData) => (
                            <span>
                                {rowData.result && rowData.result.name !== "" ? (
                                    rowData.result.name
                                ) : (
                                    <Tag value="Undefined" severity="warning" />
                                )}
                            </span>
                        )}
                                style={{ minWidth: '11rem' }} />

                        <Column  header="Creation_Date" field="dateCreation"  body={(rowData) => formatDateTime(rowData.dateCreation)}
                                 sortable sortField="dateCreation" filter style={{ minWidth: "15rem" }}></Column>


                    </DataTable>
                ) : (
                    <PopularCart/>
                )}
                    </div>
                </div>
            </MainCard>
        </>
    );
}
