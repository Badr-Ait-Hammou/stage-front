import React, {useEffect, useState,useRef} from "react";
import MainCard from "../ui-component/cards/MainCard";
import {Dropdown} from "primereact/dropdown";
import axios from "axios";
import "../style/annotation_img.css"
import {Calendar} from "primereact/calendar";
import {format} from "date-fns";
import {Link} from "react-router-dom";
import { Toast } from 'primereact/toast';


export default function Annotation() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [filteredImages, setFilteredImages] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [allImages, setAllImages] = useState([]);
    const toast = useRef(null);
    const [filteredProjects, setFilteredProjects] = useState([]);







    /***************************************** Project title ************************************************************/


    const dynamicTitle = selectedProject
        ? ` ${selectedProject.name}- Images  `
        : "Project Images";

    /***************************************** Api Get all ************************************************************/


    useEffect(() => {
        axios
            .get("http://localhost:8080/api/projet/all")
            .then((response) => {
                setProjects(response.data);
                const allImages = response.data.reduce((images, project) => {
                    images.push(...project.images);
                    return images;
                }, []);
                setAllImages(allImages);
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


    /***************************************** Api Date filter ************************************************************/


    useEffect(() => {
        if (startDate && endDate) {
            if (endDate <= startDate) {
                console.error("End date must be greater than the start date.");

                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'End date must be greater than the start date.',
                        life: 3000,
                    });

                setFilteredProjects([]);
            } else {
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
        }
    }, [startDate, endDate]);

    /**********************************  Toast  ******************************/



    /**********************************  ImageGrid  ******************************/

    const ImagesGrid = ({ images }) => {
        images = selectedProject ? images : allImages;

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
                            <div key={image.id} className="image-wrapper">
                                <Link to={`imagedetail/${image.id}`}>
                                    <img
                                        src={image.photo}
                                        alt={image.name}
                                        className="image-item-small"
                                    />
                                    <div className="tag">
                                        <i className="pi pi-spin pi-cog" style={{ fontSize: '1rem' }}></i>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

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
                            <div key={image.id} className="image-wrapper">
                                <Link to={`imagedetail/${image.id}`}>

                                <img
                                    src={image.photo}
                                    alt={image.name}
                                    className="image-item-small"
                                />
                                <div className="tag">
                                        <i className="pi pi-spin pi-cog" style={{ fontSize: '1rem' }}></i>
                                </div>
                                </Link>
                            </div>
                        ))}

                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />

            <MainCard title="Annotation">
                <Toast ref={toast} />
                <div className="font-serif mt-1">
                    <p style={{fontSize: "18px"}}>Appearance</p>
                </div>
                <div className="card flex  flex-wrap gap-3 mt-2" >
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <Dropdown
                            value={selectedProject}
                            options={projects}
                            optionLabel="name"
                            placeholder="Select a Project"
                            onChange={(e) => setSelectedProject(e.value)}
                        />
                    </div>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <p>From</p>
                        </span>
                        <Calendar
                            value={startDate}
                            dateFormat="yy-mm-dd"
                            touchUI
                            showButtonBar
                            onChange={(e) => setStartDate(e.value)}
                        />
                    </div>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <p>To</p>
                        </span>
                        <Calendar
                            value={endDate}
                            dateFormat="yy-mm-dd"
                            touchUI
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
            <div className="mt-5">
                <MainCard title="Download ">
                </MainCard>
            </div>
        </>
    );
}