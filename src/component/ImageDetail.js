import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Button} from "primereact/button";
import MainCard from "../ui-component/cards/MainCard";
import {IoAddOutline, IoRemoveOutline} from "react-icons/io5";
import {Grid} from "@mui/material";

export default function ImageDetail() {
    const {id} = useParams();
    const [image, setImage] = useState(null);
    const [zoom, setZoom] = useState(20);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/image/${id}`)
            .then((response) => {
                setImage(response.data);
            })
            .catch((error) => {
                console.error("Error fetching image details:", error);
            });
    }, [id]);

    if (!image) {
        return <p>Loading...</p>;
    }
    const handleZoomIn = () => {
        setZoom((prevZoom) => prevZoom + 10);
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(10, prevZoom - 10));
    };
    return (
        <MainCard title="Detail">

            <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <strong>ID: {image.id}</strong>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <strong>Project: {image.projet.name}</strong>
                        </Grid>
                    </Grid>

                    <div style={{ display: "flex", gap: "5px" }}>
                        <Button
                            className="p-button-outlined p-button-secondary"
                            onClick={handleZoomIn}
                            icon={<IoAddOutline />}
                        />
                        <Button
                            className="p-button-outlined p-button-secondary"
                            onClick={handleZoomOut}
                            icon={<IoRemoveOutline />}
                        />
                    </div>
                </div>
            </div>
            <div style={{

                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <img
                    src={image.photo}
                    alt={image.name}
                    style={{width: `${zoom}%`, height: "auto", objectFit: "contain"}}
                />
            </div>

        </MainCard>
    );
}
