import React,{useEffect,useState} from 'react';
import { NavLink} from 'react-router-dom';


import { getStorage } from '../../../utilities/storage';
import { apiGet } from '../../../utilities/userAuth';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';

import { validateToken } from '../../../utilities/validateToken';
import AddChatModel from '../modals/add_chat';

export default function DataTable(props) {

  const [dataGridLoading, setDataGridLoading] = useState(true);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [dataGridUserActionData, setDataGridUserActionData] = useState('');
  
  const {REACT_APP_API_URL} = process.env;
  
  useEffect( ()=>{
    validateToken();
    const userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/UserChat/getAll`;
      const params = {
        token: userInfo.token,
        //is_active: null
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
  },[REACT_APP_API_URL]);


  return (
    <div>
      <NotificationContainer/>
        <div className='dataTableWrapper'>
          <table id="Test" className='table table-striped table-responsive table-bordered p-5'>
            <thead>
              <tr>
                <th>ID</th>
                <th>User Name</th>
                <th>Game Name</th>
                <th>Message</th>
                <th>Seen</th>
                <th>Status</th>
                <th>Created at</th>   
              </tr>
            </thead>
            <tbody>
            {
              dataGridRows && dataGridRows.map((item, index) => (
                <tr key={index}>
                  {/* <NavLink  to={"/userchatinfo/"+item.id}>{item.id}</NavLink> */}
                  <td>{item.id}</td>
                  <td>{item.username}</td>
                  <td>{item.gamename}</td>
                  <td>{item.message}</td>
                  <td>{item.is_seen}</td>
                  <td>{item.is_status}</td>
                  <td>{item.date_created}</td>
                </tr>
              )) 
            }
            </tbody>
          </table>
        </div>
        <AddChatModel />
    </div>
  );

}