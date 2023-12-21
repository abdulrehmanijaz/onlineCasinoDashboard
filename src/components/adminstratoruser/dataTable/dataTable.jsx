import React,{useEffect,useState} from 'react';
import { Link, NavLink} from 'react-router-dom';
import { validateToken } from '../../../utilities/validateToken';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';
import AddUserModal from '../modals/add_user'

import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications/dist/react-notifications';

import {NotificationManager} from 'react-notifications/dist/react-notifications';

export default function DataTable(props) {
  
  const [dataGridLoading, setDataGridLoading] = useState(true);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [dataGridUserActionData, setDataGridUserActionData] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCheckShowGrid, setCheckShowGrid] = useState(false);

  
  const {REACT_APP_API_URL} = process.env;

  useEffect( ()=>{
    validateToken();
    const userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/users/getAll`;
      const params = {
        token: userInfo.token,
        role_id:2
      }
      apiGet(url,params).then(response => {
        if(response.data.code === 200){
          setDataGridLoading(false);
          setDataGridRows(response.data.data);
        }else{
          setDataGridLoading(false);
          let msg = 'Something Wrong! Please try after some time.';
          NotificationManager.error(msg);   
        }
      }).catch(error => {
        setDataGridLoading(false);
        let msg = 'Something Wrong! Please try after some time.';
        NotificationManager.error(msg);   
      });
    }else{
      setDataGridLoading(false);
    }
  },[REACT_APP_API_URL]);

  return (
    <div>
      <NotificationContainer/>
      <div className='dataTableWrapper'>
        <table id="Test" className='table table-striped table-responsive table-bordered p-5'>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Created at</th>
              <th>Status</th>   
            </tr>
          </thead>
          <tbody>
          {
            dataGridRows && dataGridRows.map((item, index) => (
              <tr key={index}>
                <td><NavLink  to={"/adminstratorinfo/"+item.id}>{item.id}</NavLink></td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.username}</td>
                <td>{item.date_created}</td>
                <td>{item.is_status}</td>
              </tr>
            )) 
          }
          </tbody>
        </table>
      </div>
      <AddUserModal />
    </div>
         
  );

}

