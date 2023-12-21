import React from 'react';
import AddChatModel from './add_chat';
import EditChatModal from './edit_chat';
export default function AllModals(props) {
    return (
      <div>
        <AddChatModel userData={props.userData} addChat={props.addChat} setDataGridLoading={props.setDataGridLoading}/>
        <EditChatModal userData={props.userData} editChat={props.editChat} setDataGridLoading={props.setDataGridLoading} />
      </div>
    );
  }