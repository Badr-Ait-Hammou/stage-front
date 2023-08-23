
import React, {useState, useRef, useEffect} from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import axios from "../utils/axios";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Grid} from "@mui/material";
import {Box} from "@mui/system";
import { FileUpload } from 'primereact/fileupload';
import EmptyImg from "../assets/images/empty.png";
import "../style/Image.css"
import html2canvas from 'html2canvas';
import { IoCameraOutline, IoAddOutline, IoRemoveOutline,IoSquareOutline } from 'react-icons/io5';
import 'leaflet-draw/dist/leaflet.draw.css'
import PopularCart from "../ui-component/cards/Skeleton/PopularCard"
import MainCard from "../ui-component/cards/MainCard";




export default function Image() {

    const [productDialog, setProductDialog] = useState(false);
    const [editproductDialog, seteditProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [description, setDescription] = useState('');
    const [format, setFormat] = useState('');
    const [projetId, setProjetId] = useState("");
    const [projet, setProjet] = useState([]);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);
    const [image, setImages] =  useState([]);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoom, setZoom] = useState(100);
   // const [showPolygonDrawing, setShowPolygonDrawing] = useState(false);
    //const [drawnItems, setDrawnItems] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingStartX, setDrawingStartX] = useState(0);
    const [drawingStartY, setDrawingStartY] = useState(0);
    const [drawingWidth, setDrawingWidth] = useState(0);
    const [drawingHeight, setDrawingHeight] = useState(0);
    const projectsWithoutFiles = projet.filter(rowData => !rowData.result || !rowData.result.file);



    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };


    useEffect(() => {
        fetchData();
        handleDataTableLoad();
    }, []);

    const fetchData = async () => {
        try {
            const projetResponse = await axios.get('/api/projet/all');
            setProjet(projetResponse.data);

            const imageResponse = await axios.get('/api/image/all');
            setImages(imageResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    /********************************************Save image *************************/


    const handleSubmit = (event) => {
        event?.preventDefault();

        if (name.trim() === '' || description.trim() === '' || format.trim()==='' || !photo ||projetId ==='') {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
            return;
        }
        axios.post("/api/image/save", {
            name,
            photo,
            description,
            format,
            projet: {
                id: projetId
            }
        }).then((response) => {
            console.log(response.data);
            console.log(photo);
            setName("");
            setPhoto("");
            setDescription("");
            setFormat("");
            setProjetId("");
            hideDialog();
            loadImage();
            showusave();
        }).catch((error) => {
            console.error("Error while saving image:", error);
        });
    };

    const handlePhotoChange = (event) => {
        const files = event.files;

        if (files && files.length > 0) {
            const file = files[0];

            if (!file.type.startsWith('image/')) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };




    /********************************************Load image *************************/
    const loadImage=async ()=>{
        const res=await axios.get(`/api/image/all`);
        setImages(res.data);
    }

    /******************************************** Delete *************************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`/api/image/${id}`)
                .then(() => {
                    setImages(image.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'Image deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting project:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'failed to delete Image', life: 3000});
                });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Image ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
    };


    const handleZoomIn = () => {
        setZoom((prevZoom) => prevZoom + 10);
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(10, prevZoom - 10));
    };

    /******************************************** Dialogues *************************/

    const openNew = () => {
        setImages(image);
        setSubmitted(false);
        setDescription("");
        setName("");
        setPhoto("");
        setDescription("");
        setFormat("");
        setProjetId("");
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        seteditProductDialog(false);
    };
    const hideeditDialog = () => {
        seteditProductDialog(false);
    };

    /***********************Update **************/

    const handleupdate = (rowData) => {
        setSelectedProject(rowData);
        setName(rowData.name);
        setDescription(rowData.description);
        setPhoto(rowData.photo);
        setFormat(rowData.format);
        seteditProductDialog(true);
    };

    const handleEdit = async (projectToUpdate) => {
        try {
            if (name.trim() === '' || description.trim() === '' || format.trim()==='' || !photo ||projetId ==='') {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
                return;
            }
            const response = await axios.put(`/api/image/${projectToUpdate.id}`, {
                name:name,
                photo:photo,
                description:description,
                format:format,
                projet: {
                    id: projetId
                }
            });

            const updatedProject = [...image];
            const updatedProjectIndex = updatedProject.findIndex((image) => image.id === projectToUpdate.id);
            updatedProject[updatedProjectIndex] = response.data;

            hideeditDialog();
            loadImage();
            showupdate()
        } catch (error) {
            console.error(error);
        }
    };

    /********************************************Toasts *************************/

    const showusave = () => {
        toast.current.show({severity:'success', summary: 'success', detail:'item added successfully', life: 3000});
    }

    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'item updated successfully', life: 3000});
    }





    const exportCSV = () => {
        dt.current.exportCSV();
    };

    /******************************************** components *************************/


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button   label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };
    const centerToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 font-bold">Manage Images</h4>
        </div>;
    };


    const dialogContentRef = useRef();

    const handleScreenshot = () => {
        try {
            const dialogContentElement = dialogContentRef.current;
            if (dialogContentElement) {
                html2canvas(dialogContentElement).then((canvas) => {
                    const screenshotUrl = canvas.toDataURL('image/png');

                    const newTab = window.open('');
                    newTab.document.write('<img alt="img" src="' + screenshotUrl + '" style="width: 100%; height: auto;" />');
                });
            }
        } catch (error) {
            console.error('Error capturing screenshot:', error);
        }
    };

    const togglePolygonDrawing = () => {
        setIsDrawing((prevState) => !prevState);
    };

    const handleImageMouseDown = (event) => {
        if (isDrawing) {
            setDrawingStartX(event.nativeEvent.offsetX);
            setDrawingStartY(event.nativeEvent.offsetY);
        }
    };

    const handleImageMouseUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
        }
    };

    const handleImageMouseMove = (event) => {
        if (isDrawing) {
            const currentX = event.nativeEvent.offsetX;
            const currentY = event.nativeEvent.offsetY;
            const width = currentX - drawingStartX;
            const height = currentY - drawingStartY;

            setDrawingWidth(width);
            setDrawingHeight(height);
        }
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined style={{marginRight:"4px"}} onClick={() => handleupdate(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => handleDelete(rowData.id)} />
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
      />
    </span>
        </div>
    );

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button  label="save"
                     severity="success"
                     raised onClick={(e) => handleSubmit(e)}/>
        </React.Fragment>
    );
    const editimageDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideeditDialog} />
            <Button label="Update" severity="info"  raised onClick={() => handleEdit(selectedProject)} />
        </React.Fragment>
    );



    const photoBodyTemplate = (rowData) => {
        const showImage = (rowData) => {
            setSelectedImage(rowData);
            setShowImageDialog(true);
        };

        if (rowData.photo) {
            return (
              <img
                src={rowData.photo}
                alt={rowData.photo}
                className="enlarge-on-hover"
                style={{
                    width: '50%',
                    height: '50%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                }}
                onError={() => console.error(`Failed to load image for row with ID: ${rowData.id}`)}
                onClick={() => showImage(rowData)}
              />
            );
        }
        return <img src={EmptyImg} alt="No" style={{ width: '50px', height: 'auto' }} />;
    };






    return (
        <>

            <MainCard>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                {dataTableLoaded ? (
                    <DataTable ref={dt} value={image}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Images" globalFilter={globalFilter} header={header}>
                    <Column field="id"  header="ID" sortable style={{ minWidth: '7rem' }}></Column>
                    <Column field="photo" header="Photo" body={photoBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" filter filterPlaceholder="Search Name ..." header="Name" sortable style={{ minWidth: '7rem' }}></Column>
                    <Column field="description"  sortable header="Description" ></Column>
                    <Column field="format" header="Format"  sortable style={{ minWidth: '8rem' }}></Column>
                    <Column header="Projet" field="projet.name" filter filterPlaceholder="Search Project ..." sortable style={{ minWidth: '7rem' }} body={(rowData) => rowData.projet.name}></Column>
                    <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
                    ):(
                        <PopularCart/>
                    )}
            </div>
            </MainCard>

            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Image" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                     <Box className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText style={{marginTop:"5px"}} id="name" value={name} onChange={(event) => setName(event.target.value)} required autoFocus />
                    {submitted && !image.name && <small className="p-error">Name is required.</small>}
                </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box className="field">
                            <label htmlFor="format" className="font-bold ">
                                Format
                            </label>
                            <InputText style={{marginTop:"5px"}} id="format"  value={format} onChange={(event) => setFormat(event.target.value)} mode="currency" currency="USD" locale="en-US" />
                        </Box>
                    </Grid>
                </Grid>



                    <Grid item xs={12} >
                        <Box className="field mt-2">
                            <label htmlFor="image" className="font-bold">
                                Photo
                            </label>
                            <FileUpload
                                className="mt-2"
                                name="photo"
                                url={'/api/upload'}
                                accept="image/*"
                                maxFileSize={1000000}
                                emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                                chooseLabel="Select Image"
                                uploadLabel="Upload"
                                cancelLabel="Cancel"
                                onSelect={(e) => handlePhotoChange(e)}
                            />

                        </Box>
                    </Grid>
                <Box className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea style={{marginTop:"5px"}} id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} cols={20} />
                </Box>
                    <Grid item xs={12} >
                        <Box className="field mt-1">
                            <label htmlFor="description" className="font-bold">
                                Project
                            </label>
                            <select
                                id="projetId"
                                className="form-control mt-2"
                                value={projetId}
                                onChange={(event) => setProjetId(event.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                }}
                            >
                                <option value="">Select Project</option>
                                {projectsWithoutFiles &&
                                    projectsWithoutFiles.map((projet) => (
                                        <option key={projet.id} value={projet.id}>
                                            {projet.name}
                                        </option>
                                    ))}
                            </select>
                        </Box>
                    </Grid>

            </Dialog>

            <Dialog visible={editproductDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Edit Image" modal className="p-fluid" footer={editimageDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box className="field">
                            <label htmlFor="name" className="font-bold">
                                Name
                            </label>
                            <InputText style={{marginTop:"5px"}} id="name" value={name} onChange={(event) => setName(event.target.value)} required autoFocus />
                            {submitted && !image.name && <small className="p-error">Name is required.</small>}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box className="field">
                            <label htmlFor="format" className="font-bold ">
                                Format
                            </label>
                            <InputText style={{marginTop:"5px"}} id="format"  value={format} onChange={(event) => setFormat(event.target.value)} mode="currency" currency="USD" locale="en-US" />
                        </Box>
                    </Grid>
                </Grid>



                <Grid item xs={12} >
                    <Box className="field mt-2">
                        <label htmlFor="quantity" className="font-bold">
                            Photo
                        </label>
                        <FileUpload
                            className="mt-2"
                            name="photo"
                            url={'/api/upload'}
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                            chooseLabel="Select Image"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            onSelect={(e) => handlePhotoChange(e)}
                        />
                    </Box>
                </Grid>
                <Box className="field mt-2">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea style={{marginTop:"5px"}} id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} cols={20} />
                </Box>
                <Grid item xs={12} >
                    <Box className="field mt-1">
                        <label htmlFor="description" className="font-bold">
                            Project
                        </label>
                        <select
                            id="projetId"
                            className="form-control mt-2"
                            value={projetId}
                            onChange={(event) => setProjetId(event.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem 1rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                            }}
                        >
                            <option value="">Select Project</option>
                            {projectsWithoutFiles &&
                                projectsWithoutFiles.map((projet) => (
                                    <option key={projet.id} value={projet.id}>
                                        {projet.name}
                                    </option>
                                ))}
                        </select>
                    </Box>
                </Grid>

            </Dialog>

            <Dialog visible={showImageDialog} style={{ width: '35rem', height: '35rem' }} onHide={() => setShowImageDialog(false)}>
                <div
                  ref={dialogContentRef}
                  style={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                  }}
                >
                    <img
                      src={selectedImage?.photo}
                      alt={selectedImage?.photo}
                      style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: `${zoom}%`,
                          height: 'auto',
                          objectFit: 'contain',
                      }}
                      onMouseDown={handleImageMouseDown}
                      onMouseUp={handleImageMouseUp}
                      onMouseMove={handleImageMouseMove}
                    />
                    <div
                      style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          display: 'flex',
                          gap: '5px',
                      }}
                    >
                        <Button
                          className="p-button-outlined p-button-secondary p-button-icon-only"
                          icon={<IoAddOutline />}
                          onClick={handleZoomIn}
                        />
                        <Button
                          className="p-button-outlined p-button-secondary p-button-icon-only"
                          icon={<IoRemoveOutline />}
                          onClick={handleZoomOut}
                        />
                        <Button
                          className="p-button-outlined p-button-secondary p-button-icon-only"
                          icon={<IoCameraOutline />}
                          onClick={handleScreenshot}
                        />

                        <Button
                          className="p-button-outlined p-button-secondary p-button-icon-only"
                          icon={<IoSquareOutline/>}
                          onClick={togglePolygonDrawing}
                        />
                    </div>
                    {isDrawing && (
                      <div
                        style={{
                            position: 'absolute',
                            border: '2px dashed red',
                            pointerEvents: 'none',
                            left: `${drawingStartX}px`,
                            top: `${drawingStartY}px`,
                            width: `${drawingWidth}px`,
                            height: `${drawingHeight}px`,
                        }}
                      />
                    )}
                </div>
            </Dialog>


        </>
    );
}
        