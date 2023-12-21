import React,{useEffect,useState} from 'react';
import { Link, NavLink} from 'react-router-dom';
import { validateToken } from '../../../utilities/validateToken';
import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';
import swal from 'sweetalert';
import 'react-notifications/lib/notifications.css';
import RefreshGrid from '../girdbuttons/RefreshGrid';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import AddNewsModal from '../modals/add_news';
export default function DataTable() {
  const [dataGridLoading, setDataGridLoading] = useState(true);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [dataGridUserActionData, setDataGridUserActionData] = useState('');
  
  const {REACT_APP_API_URL} = process.env;

    useEffect( ()=>{
      validateToken();
      const userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        let url =  `${REACT_APP_API_URL}/UserNews/getAll`;
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
    },[REACT_APP_API_URL]);

    
    
    return (
      <>
        <NotificationContainer/>
        <div className='dataTableWrapper'>
          <table id="Test" className='table table-striped table-responsive table-bordered p-5'>
            <thead>
              <tr>
                <th>ID</th>
                <th>News title</th>
                <th>News description</th>
                <th>Is sent</th>
                <th>Created at</th>
                <th>Status</th>   
              </tr>
            </thead>
            <tbody>
            {
              dataGridRows && dataGridRows.map((item, index) => (
                <tr key={index}>
                  <td><NavLink  to={"/usernewsinfo/"+item.id}>{item.id}</NavLink></td>
                  <td>{item.news_title}</td>
                  <td>{item.news_description}</td>
                  <td>{item.is_sent}</td>
                  <td>{item.date_created}</td>
                  <td>{item.is_active}</td>
                </tr>
              )) 
            }
            </tbody>
          </table>
        </div> 
        <AddNewsModal />
      </>     
    );

}