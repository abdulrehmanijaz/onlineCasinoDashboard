import React from 'react';
import AddRatingsModel from './add_ratings';
import EditRatingsModal from './edit_ratings';
export default function AllModals(props) {
    return (
      <div>
        <AddRatingsModel userData={props.userData}/>
        <EditRatingsModal userData={props.userData} />
      </div>
    );
  }