import React, { useEffect, useState } from "react";
import MainCard from "../ui-component/cards/MainCard";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import "../style/annotation_img.css"

export default function Annotation() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [filteredImages, setFilteredImages] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/projet/all")
            .then((response) => {
                setProjects(response.data);
            })
            .catch((error) => console.error("Error fetching projects:", error));
    }, []);

    useEffect(() => {
        if (selectedProject) {
            axios
                .get(`http://localhost:8080/api/projet/${selectedProject.id}`)
                .then((response) => setFilteredImages(response.data.images))
                .catch((error) => console.error("Error fetching images:", error));
        }
    }, [selectedProject]);

    const ImagesGrid = ({ images }) => {
        if (images.length === 0) {
            return <p>No images found for the selected project.</p>;
        }

        const chunkedImages = images.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 5);
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [];
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        }, []);

        return (
            <div className="images-grid">
                {chunkedImages.map((imageRow, rowIndex) => (
                    <div key={rowIndex} className="image-row">
                        {imageRow.map((image) => (
                            <img
                                key={image.id}
                                src={image.photo}
                                alt={image.name}
                                className="image-item-small"
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <>
            <MainCard title="Annotation">
                <div className="font-serif mt-1">
                    <p style={{ fontSize: "18px" }}>Appearance</p>
                </div>
                <div className="card flex flex-column md:flex-row gap-3 mt-2">
                    <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
                        <Dropdown
                            value={selectedProject}
                            options={projects}
                            optionLabel="name"
                            placeholder="Select a Project"
                            className="w-full md:w-14rem"
                            onChange={(e) => setSelectedProject(e.value)}
                        />
                    </div>
                </div>
            </MainCard>
            <div className="mt-5">
                <MainCard title="Images">
                    {/* Pass the filtered images data to the ImagesGrid component */}
                    <ImagesGrid images={filteredImages} />
                </MainCard>
            </div>
        </>
    );
}


/*
 <>
        <MainCard title="Annotation">
            <div className="font-serif mt-1 ">
                <p style={{fontSize:"18px"}}>Appearance</p>
            </div>
            <div className="card flex flex-column md:flex-row gap-3 mt-2">
                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
                    <Dropdown
                        value={selectedProjectId}
                        options={projects}
                        optionLabel="name"
                        placeholder="Select a Project"
                        className="w-full md:w-14rem"
                        onChange={(e) => setSelectedProjectId(e.value.id)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">$</span>
                    <Dropdown optionLabel="name"
                              placeholder="Select a City"
                              className="w-full md:w-14rem"
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">www</span>
                    <Dropdown optionLabel="name"
                              placeholder="Select a City"
                              className="w-full md:w-14rem"
                    />
                </div>
            </div>

            <div className="font-serif mt-5 ">
                <p style={{fontSize:"18px"}}>Filter</p>
            </div>

            <div className="card flex flex-column md:flex-row gap-3 mt-2">
                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
                    <Dropdown optionLabel="name"
                              placeholder="Select a City"
                              className="w-full md:w-14rem"
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">$</span>
                    <Dropdown optionLabel="name"
                              placeholder="Select a City"
                              className="w-full md:w-14rem"
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">www</span>
                    <Dropdown optionLabel="name"
                              placeholder="Select a City"
                              className="w-full md:w-14rem"
                    />                </div>
            </div>
            <div className="card flex flex-column md:flex-row gap-3 mt-2">
                <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
                    <Dropdown optionLabel="name"
                              placeholder="Select a City"
                              className="w-full md:w-14rem"
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">From</span>
                    <Calendar showButtonBar />

                </div>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">To</span>
                    <Calendar showButtonBar />

                </div>
            </div>

        </MainCard>




*/
 /*       <div className="mt-5">
            <MainCard title="Images">

<ImagesGrid images={filteredImages} />
</MainCard>
</div>
</>

*/