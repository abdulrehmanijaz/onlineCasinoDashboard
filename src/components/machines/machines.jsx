import React,{useEffect} from 'react'
import Header from '../header'
import { validateToken } from '../../utilities/validateToken';
export default function Machines() {
    useEffect( () => {
        validateToken();
    },[]);
  return (
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
                                <div className="machine-wrap">
                                    <div className="machine-count">
                                        <div className="machine-total">Max Machine Count 100</div>
                                    </div>
                                    <div className="machine-list">
                                        <div id="_NoMachineBox" className="clearfix">
                                            No More Machines
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </main>
    </>

  )
}
