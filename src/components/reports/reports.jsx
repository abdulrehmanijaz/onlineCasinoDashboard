import React from "react";
import Header from "../header";

import GridActions from "./girdactions/girdActions";

export default function Reports(props){
   
    return(
        <>
            <Header/>
            <main class="main-content page-bg" id="main-content">
                <div className="container-fluid py-1">
                    <div className="row">
                        <div className="col-lg-12 col-md-12"> 
                           <GridActions />
                        </div>    
                      
                    </div>
                </div>
            </main> 
        </>
    )
}