import React from 'react';
import AddLoanModel from './add_loan';
import EditLoanModal from './edit_loan';
export default function AllModals(props) {
    return (
      <div>
        <AddLoanModel userData={props.userData} addLoan={props.addLoan} setDataGridLoading={props.setDataGridLoading}/>
        <EditLoanModal userData={props.userData} editLoan={props.editLoan} setDataGridLoading={props.setDataGridLoading} />
      </div>
    );
  }