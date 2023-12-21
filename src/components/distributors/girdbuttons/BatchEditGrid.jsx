import React from 'react'
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

export default function BatchEditGrid() {
  return (
    <Button variant="text" startIcon={<EditIcon />}
      data-bs-toggle="modal" 
      data-bs-target="#batchEditdistributor" >
      Batch Edit
    </Button>
  )
}