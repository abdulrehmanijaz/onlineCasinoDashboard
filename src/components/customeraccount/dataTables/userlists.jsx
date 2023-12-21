import React, { useEffect,useState } from 'react'
import { Link, NavLink} from 'react-router-dom';
import { apiGet,apiDelete } from '../../../utilities/userAuth';
import { getStorage } from '../../../utilities/storage';
import { validateToken } from '../../../utilities/validateToken';

import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";

export default function Userlists(props) {

    const [dataGridLoading, setDataGridLoading] = useState(true);
    const [dataGridRows, setDataGridRows] = useState([]);

    const {REACT_APP_API_URL} = process.env;
    useEffect( ()=>{
        const userInfo = getStorage('userInfo');
        validateToken();
        if(userInfo && userInfo.token){
          let url = `${REACT_APP_API_URL}/users/getAll`;
            const params = {
                token: userInfo.token,
                role_id:1
            }
            apiGet(url,params).then(response => {
                if(response.data.code === 200){
                    setDataGridLoading(false);
                    let new_user_arr = [];
                    let userdata = response.data.data;
                    for(let i=0;i<userdata.length;i++){
                        let customerid = userdata[i].id;
                        let mbl_id = userdata[i].mobile_id;
                        let username = userdata[i].username;
                        let gender = userdata[i].gender;
                        let phone = userdata[i].phone;
                        let mail = userdata[i].address;
                        let obj = {
                            customerid:customerid,
                            mbl_id:mbl_id,
                            username:username,
                            gender:gender,
                            phone:phone,
                            mail:mail,
                        }
                        new_user_arr.push(obj)
                    }
                    setDataGridRows(new_user_arr)
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
        <div className='dataTableWrapper'>
            <table id="Test" className='table table-striped table-bordered p-5'>
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Mobile ID</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Mail</th>   
                    </tr>
                </thead>
                <tbody>
                {
                    dataGridRows && dataGridRows.map((item, index) => (
                        <tr>
                            <td><NavLink  to={"/customeraccount/"+item.customerid}>{item.customerid}</NavLink></td>
                            <td>{item.mbl_id}</td>
                            <td>{item.username}</td>
                            <td>{item.gender}</td>
                            <td>{item.phone}</td>
                            <td>{item.mail}</td>
                        </tr>
                    )) 
                }
                </tbody>
            </table>
        </div>
    </>
  )
}
