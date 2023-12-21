import React from "react";
import Header from "../header";
import Userlists from '../customeraccount/dataTables/userlists'
export default function Customerinfo() {

  return (
    <>
      <Header />
      <main className="main-content page-bg" id="main-content">
        <div className="box">
          <h2>Customer Info</h2>
          <div className="card mt-3">
            <div className="card-body">
              <div className='datatable_userlists'>
                <Userlists />
              </div>
            </div>
          </div>
        </div>
      </main>  
    </>     
  )
}

