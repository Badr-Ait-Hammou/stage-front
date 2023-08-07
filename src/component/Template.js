
import React, {useState, useRef, useEffect} from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import axios from "axios";
import {ConfirmDialog} from "primereact/confirmdialog";
import {Card, CardContent, Chip, Grid,} from '@mui/material';
import {Box} from "@mui/system";
import { FileUpload } from 'primereact/fileupload';
import "../style/Image.css"
import 'leaflet-draw/dist/leaflet.draw.css'
import { Dropdown } from 'primereact/dropdown';
import { Chips } from "primereact/chips";





export default function Template() {


  const [productDialog, setProductDialog] = useState(false);

  const [editproductDialog, seteditProductDialog] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [name, setName] = useState('');
  const [file, setFile] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [projetId, setProjetId] = useState("");
  const [projet, setProjet] = useState([]);
  const [fields, setFields] = useState([]);
  const [image, setImages] =  useState([]);
  const [result, setResult] =  useState([]);
  const [resultId, setResultId] =  useState("");


  const [chipsValue, setChipsValue] = useState([]);



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

  useEffect(() => {
    axios.get("http://localhost:8080/api/field/all").then((response) => {
      setFields(response.data);
    });
  }, []);
  const handleDeleteField = (fieldId) => {
    axios.delete(`http://localhost:8080/api/field/${fieldId}`).then(() => {
      fetchFields(); // Fetch the updated fields after deleting.
    }).catch((error) => {
      console.error("Error while deleting :", error);
    });
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
    event.preventDefault();

    const savePromises = chipsValue.map(chip => {
      return axios.post("http://localhost:8080/api/field/save", {
        name: chip,
        result: {
          id: resultId
        }
      });
    });

    Promise.all(savePromises)
        .then((responses) => {
          console.log("Saved all chips:", responses);
          setChipsValue([]); // Clear the chips after saving
          fetchFields(); // Fetch the updated fields
        })
        .catch((error) => {
          console.error("Error while saving chips:", error);
        });
  };

  const fetchFields = () => {
    axios.get("http://localhost:8080/api/field/all").then((response) => {
      setFields(response.data);
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





  /******************************************** components *************************/


  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button   label="New Template" icon="pi pi-plus" severity="success" onClick={openNew} />
      </div>
    );
  };



  const SecondcenterToolbarTemplate = () => {
    return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 font-bold">Manage Fields</h4>
    </div>;
  };








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






  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="card">
        <Toolbar className="mb-4" start={leftToolbarTemplate}  ></Toolbar>
        <Toolbar className="mb-4"  center={SecondcenterToolbarTemplate} ></Toolbar>
        <Grid container spacing={2}>
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
                {result.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                ))}
              </select>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="field">
              <div className="card p-fluid">
            <span className="p-float-label">
                <Chips value={chipsValue} onChange={(e) => setChipsValue(e.value)} />
                <label htmlFor="chips">Chips</label>
            </span>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12} className="mt-3">
            <Button
                label="save"
                severity="success"
                raised
                onClick={handleSave}
            />
          </Grid>
          <Grid item xs={12} className="mt-3">
          <Card>
            <CardContent>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                {fields.map((field) => (
                    <Chip
                        key={field.id}
                        label={field.name}
                        onDelete={() => handleDeleteField(field.id)}
                        color="primary"
                        style={{ marginBottom: '8px' }}
                    />
                ))}
              </div>
            </CardContent>
          </Card>
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
        