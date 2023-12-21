import React,{useEffect,useState} from 'react';
import { 
    DataGridPro, 
    useGridApiRef , 
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector
  } from '@mui/x-data-grid-pro';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/ModeEdit';
import AllModals from '../modals/all_modals';

import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';
import swal from 'sweetalert';
import 'react-notifications/lib/notifications.css';
import RefreshGrid from '../girdbuttons/RefreshGrid';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';

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
    { field: 'id', headerName: 'Game ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'image', headerName: 'Image URL', width: 250 },
    { field: 'unity_container_id', headerName: 'Unity Container ID', width: 190 },
    { field: 'is_compiled', headerName: 'Unity Compiled', width: 150 },
    { field: 'date_created', headerName: 'Created at',  width: 180 },
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
          onClick={ e => deleteUser(params.row)  }
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          data-bs-toggle="modal" 
          data-bs-target="#editGameModal"
          onClick={ e => setDataGridUserActionData(params.row) }
        />
      ]
    },
  ];

    useEffect( ()=>{
      const userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        let url =  `${REACT_APP_API_URL}/games/getAll`;
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

    const deleteUser = userData => {
      setDataGridLoading(true);
      const userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){

        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this record!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let url = `${REACT_APP_API_URL}/games/deleteOne`;
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
     
        <div className="mt-2 mb-2 card" style={{ height: 500, width: '100%' }}>
          <AllModals userData={dataGridUserActionData} addGame="Add New Game" editGame="Edit Game" />
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