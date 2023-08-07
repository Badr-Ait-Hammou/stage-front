
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
import MainCard from "../ui-component/cards/MainCard";





export default function Template() {


  const [productDialog, setProductDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
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

    if (chipsValue.length === 0 || resultId.length === 0) {
      showMissing();
      return;
    }
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
          setChipsValue([]);
          fetchFields();
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
  };



  /***********************Update **************/




  /********************************************Toasts *************************/

  const showusave = () => {
    toast.current.show({severity:'success', summary: 'success', detail:'item added successfully', life: 3000});
  }

  const showupdate = () => {
    toast.current.show({severity:'info', summary: 'success', detail:'item updated successfully', life: 3000});
  }
  const showMissing = () => {
    toast.current.show({severity:'error', summary: 'Error', detail:'one of the fields is empty', life: 3000});
  }





  /******************************************** components *************************/


  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button   label="New Template" icon="pi pi-plus" severity="success" onClick={openNew} />
      </div>
    );
  };












  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button  label="save"
               severity="success"
               raised onClick={(e) => handleSubmit(e)}/>
    </React.Fragment>
  );



  const handleResultChange = (event) => {
    setResultId(event.value);
  };



  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <MainCard title="Manage Templates"  >
      <div className="card">
        <Toolbar className="mb-4" center={leftToolbarTemplate}  ></Toolbar>
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <Box className="field mt-2 " style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="card p-fluid" style={{ width: '100%' }}>
        <span className="p-float-label" style={{ width: '100%' }}>
          <Chips value={chipsValue} onChange={(e) => setChipsValue(e.value)} />
          <label htmlFor="chips">Fields</label>
        </span>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12} >
            <Box className="field" style={{ display: 'flex', justifyContent: 'center' }}>

              <Dropdown
                  id="resultId"
                  options={result.map((template) => ({ label: template.name, value: template.id }))}
                  value={resultId}
                  onChange={handleResultChange}
                  placeholder="Select Template"
                  style={{ width: '100%' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} className="mt-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
                label="Save"
                severity="success"
                raised
                onClick={handleSave}
            />
          </Grid>

          <Grid item xs={12} className="mt-3" >
          <Card style={{backgroundColor:'rgb(236, 230, 245)'}}>
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
      </div>
      </MainCard>


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




    </>
  );
}
        