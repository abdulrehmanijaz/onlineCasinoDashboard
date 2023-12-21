import React from 'react'
import Header from '../header'
export default function ReloaderReport() {
  return (
    <>
        <Header />
        <main className="main-content page-bg" id="main-content">
            <div className="box">
                <h2>Reloader</h2>
                <div id="myTable_wrapper" className="dataTables_wrapper no-footer">
                    <table id="myTable" className='table table-bordered p-5' role="grid">
                        <thead>
                        <tr role="row">
                            <th>Name</th>
                            <th>Status</th>
                            <th>Management</th>
                        </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div> 
        </main>  
    </>
    
  )
}
