import React from 'react';
import AddProductModal from './add_product';
import EditProductModal from './edit_product';
export default function AllModals(props) {
    return (
      <div>
        <AddProductModal userData={props.userData} />
        <EditProductModal userData={props.userData} />
      </div>
    );
  }