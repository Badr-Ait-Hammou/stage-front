
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
import axios from "axios";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import { Grid,} from '@mui/material';
import {Box} from "@mui/system";
import { FileUpload } from 'primereact/fileupload';
import EmptyImg from "../assets/images/empty.png";
import "../style/Image.css"
import html2canvas from 'html2canvas';
import { IoCameraOutline, IoAddOutline, IoRemoveOutline,IoSquareOutline } from 'react-icons/io5';
import 'leaflet-draw/dist/leaflet.draw.css'
import { Dropdown } from 'primereact/dropdown';




export default function Template() {


  const [productDialog, setProductDialog] = useState(false);

  const [editproductDialog, seteditProductDialog] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [name, setName] = useState('');
  const [file, setFile] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [projetId, setProjetId] = useState("");
  const [projet, setProjet] = useState([]);
  const [image, setImages] =  useState([]);
  const [result, setResult] =  useState("");
  const [resultId, setResultId] =  useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(100);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projetResponse = await axios.get('http://localhost:8080/api/projet/all');
      setProjet(projetResponse.data);

      const resultResponse = await axios.get('http://localhost:8080/api/result/all');
      setResult(resultResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = (event) => {
    event?.preventDefault();
    axios.post("http://localhost:8080/api/result/save", {
      name,
      file,
      description,
      type,
      projet: {
        id: projetId
      }
    }).then((response) => {
      console.log(response.data);
      console.log(file);
      setName("");
      setFile("");
      setDescription("");
      setType("");
      setProjetId("");
      hideDialog();
      loadResult();
      showusave();
    }).catch((error) => {
      console.error("Error while saving file:", error);
    });
  };

  const handleSave = (event) => {
    event?.preventDefault();
    axios.post("http://localhost:8080/api/field/save", {
      name,
      result: {
        id: resultId
      }
    }).then((response) => {
      console.log(response.data);
      setName("");
      setResultId("");
      showusave();
    }).catch((error) => {
      console.error("Error while saving :", error);
    });
  };

  const handlefileChange = (event) => {
    const files = event.files;

    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        setFile(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };




  /********************************************Load Result *************************/
  const loadResult=async ()=>{
    const res=await axios.get(`http://localhost:8080/api/result/all`);
    setImages(res.data);
  }





  /******************************************** Delete *************************/

  const handleDelete = (id) => {
    const confirmDelete = () => {
      axios.delete(`http://localhost:8080/api/result/${id}`)
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
    setSubmitted(false);
    setDescription("");
    setName("");
    setFile("");
    setDescription("");
    setType("");
    setProjetId("");
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    seteditProductDialog(false);
  };
  const hideeditDialog = () => {
    // setSubmitted(false);
    seteditProductDialog(false);
  };


  /***********************Update **************/

  const handleupdate = (rowData) => {
    setSelectedProject(rowData);
    setName(rowData.name);
    setDescription(rowData.description);
    setfile(rowData.file);
    setType(rowData.type);
    seteditProductDialog(true);
  };

  const handleEdit = async (projectToUpdate) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/image/${projectToUpdate.id}`, {
        name:name,
        file:file,
        description:description,
        type:type,
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
        <Button   label="New Template" icon="pi pi-plus" severity="success" onClick={openNew} />
      </div>
    );
  };

  const centerToolbarTemplate = () => {
    return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 font-bold">Manage Templates</h4>
    </div>;
  };

  const SecondcenterToolbarTemplate = () => {
    return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 font-bold">Manage Fields</h4>
    </div>;
  };


  const dialogContentRef = useRef();

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



  const fileBodyTemplate = (rowData) => {
    const showImage = (rowData) => {
      setSelectedImage(rowData);
      setShowImageDialog(true);
    };

    if (rowData.file) {
      return (
        <img
          src={rowData.file}
          alt={rowData.file}
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
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="card">
        <Toolbar className="mb-4" start={leftToolbarTemplate}  ></Toolbar>
        <Toolbar className="mb-4"  center={SecondcenterToolbarTemplate} ></Toolbar>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box className="field">
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <InputText style={{marginLeft:"5px"}} id="name" value={name} onChange={(event) => setName(event.target.value)} required autoFocus />
              {submitted && !image.name && <small className="p-error">Name is required.</small>}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="field mt-1">

              <select
                id="resultId"
                className="form-control mt-0"
                value={resultId}
                onChange={(event) => setResultId(event.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                }}
              >
                <option value="">Select Template</option>
                {result &&
                  result.map((result) => (
                    <option key={result.id} value={result.id}>
                      {result.name}
                    </option>
                  ))}
              </select>
            </Box>
          </Grid>
          <Grid item xs={12} className="mt-3">
          <Button  label="save"
                   severity="success"
                   raised onClick={(e) => handleSave(e)}/>
          </Grid>
        </Grid>
        {/*<DataTable ref={dt} value={image}*/}
        {/*           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}*/}
        {/*           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"*/}
        {/*           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>*/}
        {/*  <Column field="id"  header="ID" sortable style={{ minWidth: '7rem' }}></Column>*/}
        {/*  <Column field="file" header="file" body={fileBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>*/}
        {/*  <Column field="name" filter filterPlaceholder="Search Name ..." header="Name" sortable style={{ minWidth: '7rem' }}></Column>*/}
        {/*  <Column field="description"  sortable header="Description" ></Column>*/}
        {/*  <Column field="type" header="Type"  sortable style={{ minWidth: '8rem' }}></Column>*/}
        {/*  <Column header="Projet" field="projet.name" filter filterPlaceholder="Search Project ..." sortable style={{ minWidth: '7rem' }} body={(rowData) => rowData.projet.name}></Column>*/}
        {/*  <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>*/}
        {/*</DataTable>*/}
      </div>

      <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Template" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
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
              <label htmlFor="type" className="font-bold">
                Type
              </label>
              <Dropdown
                style={{ marginTop: "5px" }}
                id="type"
                value={type}
                options={[
                  { label: 'Word', value: 'word' },
                  { label: 'Excel', value: 'excel' }
                ]}
                onChange={(event) => setType(event.value)}
                optionLabel="label"
                optionValue="value"
              />
            </Box>
          </Grid>

        </Grid>



        <Grid item xs={12} >
          <Box className="field mt-2">
            <label htmlFor="image" className="font-bold">
              file
            </label>
            <FileUpload
              className="mt-2"
              name="file"
              url={'/api/upload'}
              maxFileSize={100000000}
              emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
              chooseLabel="Select File"
              uploadLabel="Upload"
              cancelLabel="Cancel"
              onSelect={(e) => handlefileChange(e)}
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
              <option value="">Select Projet</option>
              {projet &&
                projet.map((projet) => (
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
              <label htmlFor="type" className="font-bold ">
                Type
              </label>
              <InputText style={{marginTop:"5px"}} id="type"  value={type} onChange={(event) => setType(event.target.value)} mode="currency" currency="USD" locale="en-US" />
            </Box>
          </Grid>
        </Grid>



        <Grid item xs={12} >
          <Box className="field mt-2">
            <label htmlFor="quantity" className="font-bold">
              file
            </label>
            <FileUpload
              className="mt-2"
              name="file"
              url={'/api/upload'}
              accept="image/*"
              maxFileSize={1000000}
              emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
              chooseLabel="Select Image"
              uploadLabel="Upload"
              cancelLabel="Cancel"
              onSelect={(e) => handlefileChange(e)}
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
              <option value="">Select Projet</option>
              {projet &&
                projet.map((projet) => (
                  <option key={projet.id} value={projet.id}>
                    {projet.name}
                  </option>
                ))}
            </select>
          </Box>
        </Grid>

      </Dialog>



    </div>
  );
}
        