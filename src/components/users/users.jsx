import React, { useEffect } from "react";
import Header from "../header";
import DataTable from './dataTable/dataTable';
import { validateToken } from '../../utilities/validateToken';

export default function Users(props){
    useEffect( () => {
        validateToken();
    },[props]);
    return(
        <>
            <Header/>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
                <div className="container-fluid py-1">
                    <div className="row">
                        <div className="col-lg-12 col-md-12"> 
                            <DataTable />
                        </div> 
                    </div>
                </div>
            </main> 
        </>
    )
}