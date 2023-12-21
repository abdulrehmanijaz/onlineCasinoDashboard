import React,{useEffect,useState} from 'react';
// import { DataGrid, GridToolbar, GridActionsCellItem} from '@mui/x-data-grid';
import { DataGridPro, useGridApiRef , GridActionsCellItem,GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector} from '@mui/x-data-grid-pro';


import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';
import BatchEditGrid from '../girdbuttons/BatchEditGrid';
import RefreshGrid from '../girdbuttons/RefreshGrid';
import GridActions from '../girdactions/GridActions';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications/dist/react-notifications';
import swal from 'sweetalert';
import {NotificationManager} from 'react-notifications/dist/react-notifications';

export default function DataTable(props) {
  
  const [dataGridLoading, setDataGridLoading] = useState(true);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [dataGridUserActionData, setDataGridUserActionData] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCheckShowGrid, setCheckShowGrid] = useState(false);

  const apiRef = useGridApiRef();  
  
  const {REACT_APP_API_URL} = process.env;

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <BatchEditGrid />
      <RefreshGrid setDataGridLoading={setDataGridLoading}/>
    </GridToolbarContainer>
    );
  };
  
  const dataGridColumns = [
    { field: 'id', headerName: 'User ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'username', headerName: 'Username',  width: 150 },
    { field: 'date_created', headerName: 'Created at',  width: 250 },
    { field: 'is_status', headerName: 'Status',  width: 100 },
    {
      field: 'userAction', 
      headerName: 'Action',
      sortable: false, width: 100,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ManageAccountsIcon />}
          label="View Profile"
          onClick={ e => gridActionsFun(params.row)  }
          showInMenu 
        />,
      ]
    },
  ];

  

  useEffect( ()=>{
    const userInfo = getStorage('userInfo');
    let get_role_id = userInfo.user_info.role_id;
    var role_id_agent = 0;
    var current_userid = 0;
    if(parseInt(get_role_id)===4){
      current_userid = userInfo.user_info.id; 
    }else if(parseInt(get_role_id) === 2){
      role_id_agent = 1;
    }

    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/users/getAll`;
      const params = {
        token: userInfo.token,
        agent_id:current_userid,
        role_id:role_id_agent
      }
    
      apiGet(url,params).then(response => {
        if(response.data.code === 200){
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
  },[props,dataGridLoading,REACT_APP_API_URL]);

 
  const gridActionsFun = paramsrow =>{
    setDataGridUserActionData(paramsrow)
    setCheckShowGrid(true)
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth'
    });
  }
  const deleteUser = userData => {
    
    const userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this user",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          setDataGridLoading(true);
          let url = `${REACT_APP_API_URL}/users/deleteOne`;
          const params = {
            token: userInfo.token,
            id : userData.id  
          }
          apiDelete(url,params).then(response => {
            setDataGridLoading(true);
            if(parseInt(response.data.code) === 200){
              swal("Poof! Your user has been deleted!", {
                icon: "success",
              });
              setDataGridLoading(false);
              setDataGridUserActionData({})
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
          swal("Your user is safe!");
          setDataGridLoading(false);
        }
      });
    }else{
      window.location('/login');
    }
  }
  return (
    <div>
      <GridActions setDataGridLoading={setDataGridLoading} isCheckShowGrid={isCheckShowGrid} setCheckShowGrid={setCheckShowGrid} deleteUser={deleteUser} selectedRows = {selectedRows} userData={dataGridUserActionData} apiRef={apiRef} />
      <div className="card mt-3">
        <div className="card-body">
          <div className="mt-2 mb-2" style={{ height: 500, width: '100%' }}>
            <NotificationContainer/>
            <DataGridPro
              rows={dataGridRows}
              columns={dataGridColumns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection={true}
              disableColumnFilter={false}
              density={'compact'}
              disableDensitySelector={false}
              disableColumnMenu={true}
              loading={dataGridLoading}
              apiRef={apiRef}
              pagination
              className={'bg-white border-0 p-1'}
              onSelectionModelChange={(ids) => {
                const selectedRowsData = ids.map((id) => dataGridRows.find((row) => row.id === id));
                setSelectedRows(selectedRowsData)
              }}
              //disableColumnFilter={true}
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          
          </div>
        </div> 
      </div> 
    </div>     
  );

}

