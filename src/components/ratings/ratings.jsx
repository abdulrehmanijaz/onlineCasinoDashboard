import React, { useEffect, useState } from "react";
import Header from "../header";
import DataTable from './dataTable/dataTable';
import PlusIcon from '@mui/icons-material/Add';
export default function Ratings(props){
    return(
        <>
            <Header/>
            <main className="main-content page-bg" id="main-content">
                <div className="box">
                <h2>Rating</h2>
                <div className="card mt-3">
                    <div className="card-body">
                        <div className='datatable_userlists'>
                            <DataTable/>
                        </div>
                    </div>
                </div>
                </div>
            </main>  
        </>
    )
}