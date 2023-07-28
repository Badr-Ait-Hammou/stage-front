import React, {useEffect, useRef, useState} from "react";
import MainCard from "../ui-component/cards/MainCard";
import {Dropdown} from "primereact/dropdown";
import axios from "axios";
import "../style/annotation_img.css"
import {Calendar} from "primereact/calendar";
import {format} from "date-fns";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { Tag } from 'primereact/tag';


export default function Annotation() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [filteredImages, setFilteredImages] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoom, setZoom] = useState(20);

    const dialogContentRef = useRef();

    const openDialog = (image) => {
        setSelectedImage(image);
        setShowImageDialog(true);
    };

    const closeDialog = () => {
        setShowImageDialog(false);
        setZoom(100);
    };


    const dynamicTitle = selectedProject
        ? ` ${selectedProject.name}- Images  `
        : "Project Images";


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

    useEffect(() => {
        if (startDate && endDate) {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            axios
                .get(`http://localhost:8080/api/projet/between/${formattedStartDate}/${formattedEndDate}`)
                .then((response) => {
                    console.log("API response:", response.data);
                    setFilteredProjects(response.data);
                })
                .catch((error) => console.error('Error fetching projects:', error));
        }
    }, [startDate, endDate]);


    /**********************************  ImageGrid  ******************************/

    const ImagesGrid = ({images}) => {
        if (!images || images.length === 0) {
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
                            <div key={image.name} className="image-wrapper">
                                <img
                                    src={image.photo}
                                    alt={image.name}
                                    className="image-item-small"
                                    onClick={() => openDialog(image)}
                                />
                                <div className="tag">
                                    <Tag className="pi pi-plus"></Tag>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

        /**********************************  ImageGrid all projects >> date filter  ******************************/

    const FilteredImagesGrid = ({projects}) => {
        const images = projects.flatMap((project) => project.images);

        if (!images || images.length === 0) {
            return <p>No images found for the selected date range.</p>;
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
                            <div key={image.name} className="image-wrapper">
                            <img
                                key={image.id}
                                src={image.photo}
                                alt={image.name}
                                className="image-item-small"
                                onClick={() => openDialog(image)} // Add the click event here
                            />
                                <div className="tag">
                                    <Tag className="pi pi-plus"></Tag>
                                </div>
                            </div>
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
                    <p style={{fontSize: "18px"}}>Appearance</p>
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

                    <div className="p-inputgroup flex-1">
                 <span className="p-inputgroup-addon">
                   <i className="pi pi-calendar"></i>
                   </span>
                        <Calendar
                            value={startDate}
                            dateFormat="yy-mm-dd"
                            placeholder="From"
                            showButtonBar
                            onChange={(e) => setStartDate(e.value)}
                        />
                    </div>
                    <div className="p-inputgroup flex-1">
                      <span className="p-inputgroup-addon">
                       <i className="pi pi-calendar"></i>
                      </span>
                        <Calendar
                            value={endDate}
                            dateFormat="yy-mm-dd"
                            placeholder="To"
                            showButtonBar
                            onChange={(e) => setEndDate(e.value)}
                        />
                    </div>
                </div>
            </MainCard>
            <div className="mt-5">
                <MainCard title={dynamicTitle}>
                    <ImagesGrid images={filteredImages}/>
                </MainCard>
            </div>

            <div className="mt-5">
                <MainCard title="All Project Images">
                    <FilteredImagesGrid projects={filteredProjects}/>
                </MainCard>
            </div>
            <Dialog
                visible={showImageDialog}
                style={{ width: "35rem", height: "35rem" }}
                onHide={closeDialog}
            >
                <div
                    ref={dialogContentRef}
                    style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <img
                        src={selectedImage?.photo}
                        alt={selectedImage?.name}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            width: `${zoom}%`,
                            height: "auto",
                            objectFit: "contain",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            display: "flex",
                            gap: "5px",
                        }}
                    >
                        <Button
                            className="p-button-outlined p-button-secondary p-button-icon-only"
                            icon={<IoAddOutline />}
                            onClick={() => setZoom((prevZoom) => prevZoom + 10)}
                        />
                        <Button
                            className="p-button-outlined p-button-secondary p-button-icon-only"
                            icon={<IoRemoveOutline />}
                            onClick={() => setZoom((prevZoom) => Math.max(10, prevZoom - 10))}
                        />
                    </div>
                </div>
            </Dialog>
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