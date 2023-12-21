import React, { useEffect } from "react";
import Header from "../header";
import DataTable from './dataTable/dataTable';
import { validateToken } from "../../utilities/validateToken";
export default function AdminstratorUsers(){
    let validateAdmistModels = ()=>{
        validateToken();
    } 
    return(
        <>
            <Header/>
            <main className="main-content page-bg" id="main-content">
                <div className="box">
                <h2>Adminstrator Info</h2>
                <div className='text-end'>
                    <button className="fancybox btn-aid" data-bs-toggle="modal" data-bs-target="#addUserModal" onClick={() =>validateAdmistModels()}> New Adminstrator </button>
                </div>
                <div className="card mt-3">
                    <div className="card-body">
                        <div className='datatable_userlists'>
                            <DataTable />
                        </div>
                    </div>
                </div>
                </div>
            </main>  
           
        </>
    )
}