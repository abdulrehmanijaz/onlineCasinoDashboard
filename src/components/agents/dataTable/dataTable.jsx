import React,{useEffect,useState} from 'react';
import { Link, NavLink} from 'react-router-dom';
import { validateToken } from '../../../utilities/validateToken';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';
import AddAgentModal from '../modals/add_agents';

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
    let get_role_id = userInfo.user_info.role_id;
    var role_id_distributor = 0;
    var current_userid = 0;
    if(parseInt(get_role_id)===3){
      current_userid = userInfo.user_info.id; 
    }else if(parseInt(get_role_id)===2){
      role_id_distributor = 4;
    }
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/users/getAll`;
      const params = {
        token: userInfo.token,
        role_id: role_id_distributor,
        distributor_id:current_userid
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
                  <td><NavLink  to={"/agentInfo/"+item.id}>{item.id}</NavLink></td>
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
      <AddAgentModal />
    </div>     
  );

}

