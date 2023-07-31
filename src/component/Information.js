import React from "react"
import MainCard from "../ui-component/cards/MainCard";
import { Panel } from 'primereact/panel';
import {Grid} from "@mui/material";
export default function Information(){


    return(

        <MainCard title="Information">
            <Panel header="Information" toggleable>
                <Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <strong>Name:</strong>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            ""
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className="mt-0.5">
                        <Grid item xs={12} sm={6}>
                            <strong>Images:</strong>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            ""
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className="mt-0.5">
                        <Grid item xs={12} sm={6}>
                            <strong>Created at:</strong>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            ""
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className="mt-0.5">
                        <Grid item xs={12} sm={6}>
                            <strong>Description:</strong>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            ""
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className="mt-0.5">
                        <Grid item xs={12} sm={6}>
                            <strong>Header:</strong>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            "Header"
                        </Grid>
                    </Grid>

                </Grid>
            </Panel>
        </MainCard>
    );
}