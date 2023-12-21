import React from 'react'
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function RefreshGrid(props) {
    const Refreshgird = ()=>{
        props.setDataGridLoading(true);
    }
  return (
    <Button variant="text" startIcon={<RefreshIcon />} onClick={Refreshgird}>
      Refresh 
    </Button>
  )
}
