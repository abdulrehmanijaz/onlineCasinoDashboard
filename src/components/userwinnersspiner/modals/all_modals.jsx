import React from 'react';
import AddWinnerModel from './add_winner';
import EditWinnerModal from './edit_winner';
export default function AllModals(props) {
    return (
      <div>
        <AddWinnerModel userData={props.userData} showModel={props.showModel}/>
        <EditWinnerModal userData={props.userData} />
      </div>
    );
  }