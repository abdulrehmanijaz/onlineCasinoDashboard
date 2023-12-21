import React from 'react';
import AddNewsModal from './add_news';
import EditNewsModal from './edit_news';

export default function AllModals(props) {
    return (
      <div>
        <AddNewsModal userData={props.userData} />
        <EditNewsModal userData={props.userData} />
      </div>
    );
  }