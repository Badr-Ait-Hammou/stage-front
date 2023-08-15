import React, { useState, useRef } from "react";
import MainCard from "../ui-component/cards/MainCard";
import {ExcelRenderer} from 'react-excel-renderer';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';



export default function ExcelFile() {
  const [header, setHeader] = useState([]);
  const [rows, setRows] = useState([]);

  const handleFile=(event) => {
    const file = event.target.files[0];
    ExcelRenderer(file,(err,response)=>{
      if(err){
        console.log(err)
      }else {
        setHeader(response.rows[0])
        setCols(response.rows)

      }
    })


  }

  return (
    <MainCard title="Information">
      <input type="file" onChange={handleFile}></input>
      <br/>
      <table>
        <DataTable value={rows}>
          {header.map((h, i) => (
            <Column key={i} field={h} header={h} />
          ))}
        </DataTable>
      </table>

    </MainCard>
  );
}
