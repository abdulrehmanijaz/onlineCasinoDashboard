import React, { useEffect, useState } from "react";
import Header from "../header";
import DataTable from './dataTable/dataTable';
import { useNavigate } from "react-router";
import { validateToken } from '../../utilities/validateToken';
import AddWinnerModel from "./modals/add_winner";
export default function UserWinners(props){

    const [showModel,setHideModel] = useState(false);
    const navigate = useNavigate();
    let validateAdmistModels = ()=>{
        validateToken()
    }
    const SetShowModel = () =>{
        setHideModel(true);
    }
    const hanldeClickRow = () =>{
        navigate('/wheelwinners');
    }
    //
    return(
        <>  
           <Header/>
            <main className="main-content page-bg" id="main-content">
                <div className="box">
                    <h2>Scheduler</h2>
                    <div className='text-end'>
                        <button 
                        className="fancybox btn-aid" 
                        onClick={() => hanldeClickRow()}
                       > Wheel Winners </button>
                        &nbsp;
                        <button 
                        className="fancybox btn-aid" 
                        onClick={SetShowModel} 
                        data-bs-toggle="modal" 
                        data-bs-target="#addWinnerModal" > Add Schedule </button>
                    </div>
                    <AddWinnerModel showModel={showModel}/>
               
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