import React from 'react';
import AddCurrencyModal from './add_currency';
import EditCurrencyModal from './edit_currency';
export default function AllModals(props) {
    return (
      <div>
        <AddCurrencyModal userData={props.userData} addCurrency={props.addCurrency} />
        <EditCurrencyModal userData={props.userData} editCurrency={props.editCurrency} />
      </div>
    );
  }