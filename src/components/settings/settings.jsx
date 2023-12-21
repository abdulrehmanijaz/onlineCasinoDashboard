import React, { useEffect, useState } from "react";
import Header from "../header";
import DataTable from './dataTable/dataTable';
import PlusIcon from '@mui/icons-material/Add';
import { validateToken } from '../../utilities/validateToken';
export default function Settings(props){
    useEffect( () => {
        validateToken();
    },[props]);
    return(
        <>
            <Header/>
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
                {/* <h6 class="font-weight-bolder mb-0 py-4">System Settings</h6> */}
                <div class="container-fluid py-1">
                    <div class="row">
                        <div className="col-lg-12 col-md-12"> 
                            <div className="card">
                                <div className="card-header">
                                    <span className="float-start">
                                        <h4>System Settings</h4>
                                    </span>
                                    <span className="float-end">
                                        <a href="#" data-bs-toggle="modal" data-bs-target="#addCurrencyModal"className="btn btn-outline-primary"><PlusIcon/> Add Currency</a>
                                    </span> 
                                </div>
                                <div className="card-body">
                                    <p className="card-text">Global system settings</p>
                                </div>
                            </div>
                            <div className="card mt-3">
                                <div className="card-body">
                                    <DataTable/>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </main>                            
        </>
    )
}