import React, { useEffect, useState } from "react";
import MainCard from "../ui-component/cards/MainCard";
import axios from "axios";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";

export default function ProjectPage() {
    const [client, setClient] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/users/1").then((response) => {
            setClient(response.data);
            console.log(response.data);
        });
    }, []);

    const imageTemplate = (rowData) => {
        return (
            <>
                {rowData.projetList && rowData.projetList.length > 0 ? (
                    rowData.projetList.map((project) => (
                        <div key={project.id}>
                            <h3>{project.name}</h3>
                            {project.images.map((image) => (
                                <div key={image.id}>
                                    <img
                                        src={image.photo} // Assuming image.photo contains direct image URLs
                                        alt={image.name}
                                        width="100"
                                        height="100"
                                    />
                                    <p>{image.name}</p>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <span>No projects or images found</span>
                )}
            </>
        );
    };

    return (
        <MainCard>
            <div className="card">
                <Toolbar className="mb-2" />
                <div style={{ borderRadius: "10px", overflow: "hidden" }}>
                    <DataTable value={client.projetList}>
                        <Column field="name" header="Project Name" />
                        <Column header="Images" body={imageTemplate} />
                    </DataTable>
                </div>
            </div>
        </MainCard>
    );
}
