import React, { useEffect } from "react";
import Header from "../header";
import DataTable from './dataTable/dataTable';
import PlusIcon from '@mui/icons-material/Add';
import { validateToken } from '../../utilities/validateToken';

export default function UserNews(){
    let validateAdmistModels = ()=>{
        validateToken();
    } 
    return(
    <>
        <Header/>
        <main className="main-content page-bg" id="main-content">
            <div className="box">
                <h2>User News</h2>
                <div className='text-end'>
                    <button className="fancybox btn-aid" data-bs-toggle="modal" data-bs-target="#addNewsModal" onClick={() =>validateAdmistModels()}> New News </button>
                </div>
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