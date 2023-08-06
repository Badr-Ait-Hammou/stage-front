import "../style/project_details.css"
import React, { useState, useEffect } from 'react';
import { Toolbar } from 'primereact/toolbar';
import axios from "axios";
import MainCard from "../ui-component/cards/MainCard";
import {useParams} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

export default function ProjectDetails() {
    const [project, setProject] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projet/${id}`).then((response) => {
            setProject(response.data);
        });
    }, []);


    const imageBodyTemplate = (photo) => {
        return <img className=" image-item-small " src={photo.photo} alt={photo.name}/>
    };

    const header = (
        <div className="mt-2 mb-2">
            <span className="text-xl text-900 font-bold">{project.name} Images</span>
        </div>
    );
    const footer = (
        <div >
            <p>
                In total there {project.images && project.images.length === 1 ? "is" : "are"}{" "}
                {project.images ? project.images.length : 0}{" "}
                {project.images && project.images.length === 1 ? "image" : "images"} on the{" "}
                {project.name} project.
            </p>
        </div>
    );


    return (
        <MainCard>
            <div className="card">
                <Toolbar className="mb-2"  center={header}/>
                <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
                    <DataTable value={project.images} footer={footer} tableStyle={{ minWidth: '30rem' }}>
                        <Column field="id" sortable  header="ID"></Column>
                        <Column header="Images" body={imageBodyTemplate}></Column>
                        <Column field="name" sortable filter header="Name" ></Column>
                    </DataTable>
                </div>
                </div>
        </MainCard>
    );
}
