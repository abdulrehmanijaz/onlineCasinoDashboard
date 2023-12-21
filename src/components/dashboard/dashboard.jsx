import React, { useEffect} from "react";
import Header from "../header";
import {  getStorage } from '../../utilities/storage';
import { validateToken } from '../../utilities/validateToken';

export default function Dashboard(){

    useEffect( () => {
        validateToken();
    },[]);
    
    let userInfo = getStorage('userInfo');
   
    var role_id;
    if(userInfo !=="" && userInfo !== null){
        role_id = userInfo.user_info.role_id;
    }
    
   
    return(
        <>
            <Header/>
            <main className="main-content page-bg" id="main-content">
                <div className="box">
                    <div className="row">
                        <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
                            <div className="card">
                                {/* <div className="card-header">
                                    <h4>Welcome to dashboard</h4>
                                </div> */}
                                <div className="card-body">
                                    <h3 className="card-title">Welcome to Game DB</h3>
                                    <h6 className="card-title">Hello,  { userInfo ? userInfo.user_info.name : ''}</h6>
                                    <p className="card-text">You are logged-in as an { parseInt(role_id) ===  3 ? 'Distributor' : parseInt(role_id) ===  4 ? 'Agent' : parseInt(role_id) ===  1 ? 'Player' : parseInt(role_id) ===  2 ? 'Adminstrator': '' }</p>
                                    <a href="/logout" className="btn btn-info">Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </main>
        </>
    )
}