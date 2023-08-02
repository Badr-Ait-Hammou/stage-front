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


    const imageBodyTemplate = (photo) => {
        return <img className=" image-item-small w-20 sm:w-16rem xl:w-10rem h-20 sm:h-16rem xl:h-10rem shadow-2 block xl:block mx-auto border-round" src={photo.photo} alt={photo.name}/>
    };

    const header = (
        <div className="mt-2 mb-2">
            <span className="text-xl text-900 font-bold">{project.name} Images</span>
        </div>
    );
    const footer = `In total there are ${project.images ? project.images.length : 0} images on the ${project.name} project.`;





    useEffect(() => {
        axios.get(`http://localhost:8080/api/projet/${id}`).then((response) => {
            setProject(response.data);
        });
    }, []);



    return (
        <MainCard>
            <div className="card">
                <Toolbar className="mb-2"  center={header}/>
                <DataTable value={project.images}  footer={footer} tableStyle={{ minWidth: '30rem' }}>
                    <Column field="id" sortable  header="ID"></Column>
                    <Column header="Images" body={imageBodyTemplate}></Column>
                    <Column field="name" filter header="Name" ></Column>
                    <Column field="comment" header="Comment"></Column>
                </DataTable>
            </div>
        </MainCard>
    );
}
