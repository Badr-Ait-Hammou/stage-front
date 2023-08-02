import React from "react"
import MainCard from "../ui-component/cards/MainCard";
import { useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export default function ProjectDetails() {
    const {id} = useParams();
    const [project, setProjects] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:8080/api/projet/${id}`).then((response) => {
            setProjects(response.data);
        });
    }, [id]);


    return (
        <>
            <MainCard title="project_details">
                <div>{project.id}</div>
                <div>{project.name}</div>
            </MainCard>
            <MainCard title="project_details">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    justifyContent: 'center'
                }}>
                    {project && project.images && project.images.map((photo) => (
                        <img
                            key={photo.id}
                            src={photo.photo}
                            alt={photo.name}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            onError={() => console.error(`Failed to load image for ID: ${photo.id}`)}
                        />
                    ))}
                </div>
            </MainCard>
        </>

    );
}