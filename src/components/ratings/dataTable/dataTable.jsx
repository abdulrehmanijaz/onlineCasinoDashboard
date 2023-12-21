import React,{useEffect,useState} from 'react';
import { validateToken } from '../../../utilities/validateToken';
import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';
import { Link, NavLink} from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import swal from 'sweetalert';

export default function DataTable() {

  const [dataGridLoading, setDataGridLoading] = useState(true);
  const [dataGridRows, setDataGridRows] = useState([]);
  
  const {REACT_APP_API_URL} = process.env;

  useEffect( ()=>{
    validateToken()
    const userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/UserRatings/getAll`;
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
          let url = `${REACT_APP_API_URL}/UserRatings/deleteOne`;
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
    <>
    <NotificationContainer/>
    {/* <AllModals userData={dataGridUserActionData} addRatings="Add Rating" editRatings="Edit Ratings" setDataGridLoading={setDataGridLoading}  /> */}
      <div className='dataTableWrapper'>
        <table id="Test" className='table table-striped table-bordered p-5'>
            <thead>
                <tr>
                  <th>ID</th>
                  <th>User Name</th>
                  <th>Game Name</th>
                  <th>Winning Count</th>
                  <th>Rating</th>
                  <th>Status</th>   
                  <th>Created at</th>   
                </tr>
            </thead>
            <tbody>
            {
              dataGridRows && dataGridRows.map((item, index) => (
                <tr>
                  <td><NavLink  to={"/rating/"+item.id}>{item.id}</NavLink></td>
                  <td>{item.username}</td>
                  <td>{item.gamename}</td>
                  <td>{item.winning_count}</td>
                  <td>{item.rating}</td>
                  <td>{item.is_active}</td>
                  <td>{item.date_created}</td>
                </tr>
              )) 
            }
            </tbody>
        </table>
      </div>
    </>
  );

}