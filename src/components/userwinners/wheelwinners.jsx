import React, {useState } from "react";
import Header from "../header";
import WheelWinnerDataTable from './dataTable/wheelwinnerdataTable';
import { useNavigate } from "react-router";

export default function WheelWinners(props){
    const navigate = useNavigate();
    // const [showModel,setHideModel] = useState(false);
    const backBtn = () =>{
        navigate('/userwinners');
      }
    return(
        <>  
           <Header/>
            <main className="main-content page-bg" id="main-content">
                <div className="box">
                    <h2>Wheel Winners</h2>
                    <div className='text-end'>
                        <button 
                        className="fancybox btn-aid" 
                        onClick={backBtn} 
                        > Back </button>
                    </div>
                    <br />
                    {/* <AddWinnerModel showModel={showModel}/> */}
               
                    <div className="card mt-3">
                        <div className="card-body">
                            <div className='datatable_userlists'>
                                <WheelWinnerDataTable />
                            </div>
                        </div>
                    </div>
                </div>
            </main>  
            
        </>
    )
}