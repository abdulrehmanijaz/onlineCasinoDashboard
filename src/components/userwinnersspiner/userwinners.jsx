import React, { useEffect, useState } from "react";
import Header from "../header";
import DataTable from './dataTable/dataTable';
import PlusIcon from '@mui/icons-material/Add';
import { validateToken } from '../../utilities/validateToken';
import AddWinnerModel from "./modals/add_winner";
export default function UserWinners(props){

    const [showModel,setHideModel] = useState(false);
    let validateAdmistModels = ()=>{
        validateToken()
    }
    const SetShowModel = () =>{
        setHideModel(true);
    }
    return(
        <>  
           <Header/>
            <main className="main-content page-bg" id="main-content">
                <div className="box">
                <h2>User Winner</h2>
                <div className='text-end'>
                    <button className="fancybox btn-aid" onClick={SetShowModel} data-bs-toggle="modal" data-bs-target="#addWinnerModal" > Add Winner </button>
                    <AddWinnerModel showModel={showModel}/>
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