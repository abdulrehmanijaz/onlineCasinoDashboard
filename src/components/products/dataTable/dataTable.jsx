import React,{useEffect,useState} from 'react';
import { validateToken } from '../../../utilities/validateToken';
import AllModals from '../modals/all_modals';
import { Link, NavLink} from 'react-router-dom';
import { getStorage } from '../../../utilities/storage';
import { apiGet,apiDelete } from '../../../utilities/userAuth';
import { useNavigate    } from "react-router";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import swal from 'sweetalert';
import AddProductModal from "../modals/add_product";

export default function DataTable(props) {

  const [dataGridLoading, setDataGridLoading] = useState(false);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [dataGridUserActionData, setDataGridUserActionData] = useState('');
  
  const {REACT_APP_API_URL} = process.env;
  const navigate = useNavigate();
  useEffect( ()=>{
    validateToken()
    setDataGridLoading(true)
    const userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/products/getAll`;
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
  },[REACT_APP_API_URL,]);

  return (
    <div>
      <NotificationContainer/>
      <div className='dataTableWrapper'>
        <table id="Test" className='table table-striped table-responsive table-bordered p-5'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Creator</th>
              <th>Product Name</th>
              <th>File URL</th>
              <th>Price</th>
              <th>Type</th>
              <th>Created at</th> 
              <th>Status</th>   
            </tr>
          </thead>
          <tbody>
          {
            dataGridRows && dataGridRows.map((item, index) => (
              <tr key={index}>
                <td><NavLink  to={"/product/"+item.id}>{item.id}</NavLink></td>
                <td>{item.user_name}</td>
                <td>{item.name}</td>
                <td>{item.file_name}</td>
                <td>{item.price}</td>
                <td>{item.type}</td>
                <td>{item.date_created}</td>
                <td>{item.is_status}</td>
              </tr>
            )) 
          }
          </tbody>
        </table>
      </div>
      <AddProductModal/>
    </div>
  );

}