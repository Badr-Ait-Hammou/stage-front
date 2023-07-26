import React from "react"
import MainCard from "../ui-component/cards/MainCard";
import {Dropdown} from "primereact/dropdown";
import { Calendar } from 'primereact/calendar';

export default function Annotation(){


    return(
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





<div className="mt-5">
    <MainCard  title="Images">


    </MainCard>
</div>
</>


    );
}