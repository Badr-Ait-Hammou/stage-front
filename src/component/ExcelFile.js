import React, { useState, useRef } from "react";
import MainCard from "../ui-component/cards/MainCard";
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { Column } from 'primereact/column';

export default function ExcelFile() {
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const dt = useRef(null);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (parsedData.length > 0) {
          const [headerRow, ...dataRows] = parsedData;
          setHeaders(headerRow);
          setTableData(dataRows);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };


  const rightToolbarTemplate = () => {
    return (
      <div className="p-fileupload p-component">
        <span className="p-button p-fileupload-choose">
  <FileUpload
    className="mt-2"
    name="photo"
    url={'/api/upload'}
    accept=".xlsx, .xls"
    maxFileSize={1000000}
    emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
    chooseLabel="Select File"
    uploadLabel="Upload"
    cancelLabel="Cancel"
    onChange={(e) => handleFileUpload(e)}
  />
        </span>
      </div>
    );
  };

  const centerToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0 font-bold">Manage Excel Files</h4>
      </div>
    );
  };

  return (
    <MainCard title="Information">
      <Toolbar className="mb-4" start={rightToolbarTemplate} center={centerToolbarTemplate}></Toolbar>

      <div className="datatable-demo">
        <DataTable
          ref={dt}
          value={tableData}
          header={headers?.map((header, index) => (
            <Column key={index} field={header} header={header} />
          ))}
        ></DataTable>
      </div>
    </MainCard>
  );
}
