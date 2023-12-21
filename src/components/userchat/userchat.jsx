import React from "react";
import Header from "../header";
import DataTable from './dataTable/dataTable';
import { validateToken } from '../../utilities/validateToken';
export default function UserChat(){
    let validateAdmistModels = ()=>{
        validateToken();
    }
    return(
        <>
            <Header/>
            <main className="main-content page-bg" id="main-content">
                <div className="box">
                    <h2>UserChat</h2>
                    <div className='text-end'>
                        <button className="fancybox btn-aid" data-bs-toggle="modal" data-bs-target="#addChatModal" onClick={() =>validateAdmistModels()}> New Chat </button>
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