import React, { useState, useEffect } from "react";
import MainCard from "../ui-component/cards/MainCard";
import axios from "axios";
import { Panel } from "primereact/panel";
import { Grid } from "@mui/material";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import EmptyImg from "../assets/images/empty.png";
import Card from "@mui/material/Card";
import { Rating } from "primereact/rating";
import { Button } from 'primereact/button';


export default function AllComments() {
    const [users, setUsers] = useState([]);
    const [selectedProjectComments, setSelectedProjectComments] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        const res = await axios.get("http://localhost:8080/api/users/role/CLIENT");
        setUsers(res.data);
    };

    const photoBodyTemplate = (rowData) => {
        if (rowData.images && rowData.images.length > 0) {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 2fr)', gap: '2px' , justifyContent: 'center' }}>
                    {rowData.images.map((image) => (
                        <img
                            src={image.photo}
                            alt={image.name}
                            style={{ width: '30px', height: 'auto' }}
                            className="image-item-small"
                            onError={() => console.error(`Failed to load image for ID: ${image.id}`)}
                        />
                    ))}
                </div>
            );
        } else {
            return <img src={EmptyImg} alt="No" style={{ width: '30px', height: 'auto' }} />;
        }
    };
    const handleProjectClick = async (projectId) => {
        try {
            if (selectedProjectId === projectId) {
                setSelectedProjectComments([]);
                setSelectedProjectId(null);
            } else {
                const res = await axios.get(`http://localhost:8080/api/comment/projet/${projectId}`);
                setSelectedProjectComments(res.data);
                setSelectedProjectId(projectId);
            }
        } catch (error) {
            console.error("Failed to load comments for the project with ID: ", projectId);
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
            <MainCard title="Comments">
                {users.map((user) => (
                    <Panel key={user.id} header={`UserName: ${user.firstName}`} toggleable collapsed={true} className="mt-5">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div style={{ borderRadius: "10px", overflow: "hidden" }}>
                                    <DataTable value={user.projetList} tableStyle={{ height: "5rem" }}>
                                        <Column field="id" sortable header="ID"></Column>
                                        <Column header="Images" body={photoBodyTemplate}></Column>
                                        <Column field="name" sortable filter header="Name"></Column>
                                        <Column
                                            header="Comments"
                                            body={(rowData) => (
                                                <Button onClick={() => handleProjectClick(rowData.id)}
                                                        style={{ fontSize: "12px", padding: "5px 10px" }}>
                                                    {selectedProjectId === rowData.id ? "Hide Comments" : "Show Comments"}
                                                </Button>
                                            )}
                                        ></Column>
                                    </DataTable>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <strong>Comments:</strong>
                                {user.projetList.map((project) => (
                                    <React.Fragment key={project.id}>
                                        {selectedProjectId === project.id && (
                                            <div>

                                                {selectedProjectComments.map((comment) => (
                                                    <Card
                                                        key={comment.id}
                                                        className="mt-5"
                                                        style={{
                                                            backgroundColor: "rgb(236,230,245)",
                                                            padding: "20px",
                                                            borderRadius: "10px",
                                                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                            position: "relative",
                                                        }}
                                                    >
                                                        <Rating
                                                            value={comment.rate}
                                                            readOnly
                                                            cancel={false}
                                                            style={{ fontSize: "18px", marginBottom: "10px" }}
                                                        />
                                                        <p style={{ fontSize: "25px", marginBottom: "10px" }}>{comment.note}</p>
                                                        <p style={{ fontSize: '15px', marginTop: '20px' }}>
                                                            {formatDateTime(comment.commentDate)}
                                                        </p>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </Grid>
                        </Grid>
                    </Panel>
                ))}
            </MainCard>
        </>
    );
}