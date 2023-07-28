import React, {useEffect, useState} from "react";
import MainCard from "../ui-component/cards/MainCard";
import {Dropdown} from "primereact/dropdown";
import axios from "axios";
import "../style/annotation_img.css"
import {Calendar} from "primereact/calendar";
import {format} from "date-fns";


export default function Annotation() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [filteredImages, setFilteredImages] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredProjects, setFilteredProjects] = useState([]);


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
                            <img
                                key={image.name}
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
                            placeholder="start"
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
                            placeholder="end"
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