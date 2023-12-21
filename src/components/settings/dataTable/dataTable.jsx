import React,{useEffect,useState} from 'react';
import { DataGridPro, useGridApiRef , GridActionsCellItem,GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector} from '@mui/x-data-grid-pro';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/ModeEdit';
import AllModals from '../modals/all_modals';

import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import RefreshGrid from '../girdbuttons/RefreshGrid';

import swal from 'sweetalert';

export default function DataTable(props) {
  const [dataGridLoading, setDataGridLoading] = useState(true);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [dataGridUserActionData, setDataGridUserActionData] = useState('');
  const {REACT_APP_API_URL} = process.env;
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <RefreshGrid setDataGridLoading={setDataGridLoading}/>
    </GridToolbarContainer>
    );
  };
  const dataGridColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'game_name', headerName: 'Game', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'symbol', headerName: 'Symbol', width: 150 },
    { field: 'conversion_rate', headerName: 'Conversion Rate',  width: 150 },
    { field: 'date_created', headerName: 'Created at',  width: 250 },
    { field: 'is_status', headerName: 'Status',  width: 100 },
    {
      field: 'userAction', 
      headerName: 'Action',
      sortable: false, width: 100,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={ e => deleteCurrency(params.row)  }
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit Currency"
          data-bs-toggle="modal" 
          data-bs-target="#editCurrencyModal"
          onClick={ e => setDataGridUserActionData(params.row) }
        />
      ]
    },
  ];

    useEffect( ()=>{
      const userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        let url = `${REACT_APP_API_URL}/currency/getAll`;
        const params = {
          token: userInfo.token,
          //is_active: null
        }
        apiGet(url,params).then(response => {
          if(parseInt(response.data.code) === 200){
            setDataGridLoading(false);
            setDataGridRows(response.data.data);
          }else{
            setDataGridLoading(false);
          }
        }).catch(error => {
          setDataGridLoading(false);
        });
      }else{
        setDataGridLoading(false);
      }
    },[props,dataGridLoading]);

    const deleteCurrency = userData => {
      setDataGridLoading(true);
      const userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        setDataGridLoading(false);
        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this record!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let url = `${REACT_APP_API_URL}/currency/deleteOne`;
            const params = {
              token: userInfo.token,
              id : userData.id  
            }
            apiDelete(url,params).then(response => {
              if(parseInt(response.data.code) === 200){
                setDataGridLoading(false);
                swal("Poof! Deleted Successfully", {
                  icon: "success",
                });
                //NotificationManager.success('Deleted Successfully');
              }else{
                setDataGridLoading(false);
                NotificationManager.error(response.data.message);
              }
            }).catch(error => {
              setDataGridLoading(false);
              let msg = 'Response Error! Please try again later.';
              NotificationManager.error(msg);
            });
           
          } else {
            setDataGridLoading(false);
            swal("Your record is safe!");
          }
        });
      }else{
        setDataGridLoading(false);
        let msg = 'Something Wrong! Please try after some time.';
        NotificationManager.error(msg);
      }
    }

    return (
      <div className="mt-2 mb-2" style={{ height: 500, width: '100%' }}>
        <AllModals userData={dataGridUserActionData} addCurrency="Add New Currency" editCurrency="Edit Currency"  />
        <NotificationContainer/>
        <DataGridPro
          rows={dataGridRows}
          columns={dataGridColumns}
          pageSize={12}
          rowsPerPageOptions={[10,20,50,100,500]}
          checkboxSelection={false}
          disableColumnFilter={false}
          density={'compact'}
          disableDensitySelector={false}
          disableColumnMenu={true}
          loading={dataGridLoading}
          className={'bg-white border-0 p-1'}
          //disableColumnFilter={true}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
    );

}