import React from 'react';
import AddGameModal from './add_game';
import EditGameModal from './edit_game';

export default function AllModals(props) {
    return (
      <div>
        <AddGameModal userData={props.userData} addGame={props.addGame} />
        <EditGameModal userData={props.userData} editGame={props.editGame} />
      </div>
    );
  }