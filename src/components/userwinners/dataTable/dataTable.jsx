import React,{useEffect,useState} from 'react';
import { NavLink} from 'react-router-dom';

import AddWinnerModel from '../modals/add_winner';

import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import { validateToken } from '../../../utilities/validateToken';
import swal from 'sweetalert';
import dateFormat from "dateformat";

export default function DataTable(props) {

  const [dataGridLoading, setDataGridLoading] = useState(true);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [dataGridUserActionData, setDataGridUserActionData] = useState('');
  
  const {REACT_APP_API_URL} = process.env;

  useEffect( ()=>{
    const userInfo = getStorage('userInfo');
    validateToken()
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/CronScheduler/getAll`;
      const params = {
        token: userInfo.token,
        //is_active: null
      }
      apiGet(url,params).then(response => {
        if(response.data.code === 200){
          setDataGridLoading(false);
          // console.log(response.data.data)
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

  const deleteProduct = userData => {
   
    const userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this reocrd!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          setDataGridLoading(true);
          let url = `${REACT_APP_API_URL}/UserWinner/deleteOne`;
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
    <div>
      <NotificationContainer/>
      <div className='dataTableWrapper'>
        <table id="Test" className='table table-striped table-responsive table-bordered p-5'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Reward Amount</th>
              <th>How Many Winners?</th>
              <th>Cron Interval</th>
              <th>Weekly Cron Time</th>
              <th>Weekly Cron Day</th>
              <th>Monthly Cron Time</th>
              <th>Monthly Cron Date</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
          {
            dataGridRows && dataGridRows.map((item, index) => (
              <tr key={index}>
                <td><NavLink  to={"/userwinnersinfo/"+item.id}>{item.id}</NavLink></td>
                <td>{item.reward_amount}</td>
                <td>{item.how_many_winners}</td>
                <td>{item.cron_interval}</td>
                <td>{item.week_cron_time ? item.week_cron_time : '-'}</td>
                <td>{item.week_cron_day ? item.week_cron_day : '-'}</td>
                <td>{item.monthly_cron_time ? item.monthly_cron_time : '-'}</td>
                <td>{item.monthly_cron_date ? item.monthly_cron_date : '-'}</td>
                <td>{item.is_active}</td>
                <td>{dateFormat(item.created_at,"d-mmmm-yyyy h:MM:ss")}</td>
              </tr>
            )) 
          }
          </tbody>
        </table>
      </div>
      <AddWinnerModel />
    </div>
  );

}