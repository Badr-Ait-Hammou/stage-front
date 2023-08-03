import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
import MainCard from "../ui-component/cards/MainCard";
import {IoAddOutline, IoRefreshOutline, IoRemoveOutline} from "react-icons/io5";
import { Grid } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function ImageDetail() {
    const { id } = useParams();
    const [image, setImage] = useState(null);

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


    return (
        <MainCard title="Detail">
            <div style={{ position: "relative" }}>
                <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}
                >
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

                        />
                    </div>
                </div>
            </div>

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <TransformWrapper
                    options={{
                        limitToBounds: false,
                        minScale: 0.1,
                        maxScale: 1,
                    }}
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            <TransformComponent >
                                <img
                                    src={image.photo}
                                    alt={image.name}
                                    style={{ width: "700px", height: "500px", border: "0.5px solid #ccc",borderRadius:"20px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}                                />
                            </TransformComponent>


                            <div style={{ position: "absolute", top:5, right:0, display: "flex", flexDirection: "column" }}>
                                <Button
                                    className="p-button-outlined p-button-secondary"

                                    onClick={() => zoomIn(0.1)}
                                    icon={<IoAddOutline />}
                                />
                                <Button
                                    className="p-button-outlined p-button-secondary mt-5"
                                    style={{marginTop:"5px"}}
                                    onClick={() => zoomOut(0.1)}
                                    icon={<IoRemoveOutline />}
                                />
                                <Button
                                    className="p-button-outlined p-button-secondary"
                                    style={{marginTop:"5px"}}
                                    onClick={() => resetTransform(true)}
                                    icon={<IoRefreshOutline />}
                                />
                            </div>
                        </>
                    )}
                </TransformWrapper>
            </div>

        </MainCard>
    );
}
