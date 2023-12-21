import React from 'react'
import { Backdrop } from '@mui/material'
import { CircularProgress } from '@mui/material'
export default function Spinner() {
  return (
    <>
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    </>
  )
}
