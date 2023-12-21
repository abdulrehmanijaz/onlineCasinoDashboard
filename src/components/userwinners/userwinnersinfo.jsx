import React, { useEffect,useState } from 'react'
import { useParams,useNavigate    } from "react-router";
import { apiGet,apiPut,apiDelete } from '../../utilities/userAuth';
import { validateToken } from '../../utilities/validateToken';
import { getStorage } from '../../utilities/storage';
import Header from "../header";
import AllModals from './modals/all_modals';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import swal from 'sweetalert';

export default function UserWinnersInfo(props) {
   
    const [isStatusChange, setisStatusChange] = useState(false);
    const [dataGridRows, setDataGridRows] = useState([]);
    const [winnerGet,setwinnerGet]=useState([]);

    const navigate = useNavigate();
    const {REACT_APP_API_URL} = process.env;
    const get_params = useParams();
    const [showModel,setHideModel] = useState(false);
    const SetShowModel = () =>{
        setHideModel(true);
    }
    useEffect( () => {
        validateToken();
        const userInfo = getStorage('userInfo');
        if(userInfo && userInfo.token && get_params.id !==undefined){
            let url = `${REACT_APP_API_URL}/CronScheduler/getOne`;
            const params = {
                token: userInfo.token,
                id:get_params.id
            }
            apiGet(url,params).then(response => {
                if(response.data.code === 200){
                    let userdata = response.data.data;
                    setDataGridRows(userdata)
                    let url = `${REACT_APP_API_URL}/UserWinner/getAll`;
                    const params = {
                        token: userInfo.token,
                        cron_id:get_params.id
                    }
                    apiGet(url,params).then(response => {
                        if(response.data.code === 200){
                       
                        // console.log(response.data.data)
                            setwinnerGet(response.data.data);
                        }else{
                       
                        }
                    }).catch(error => {
                       
                    });
                    
                }else{
                    let msg = 'Something Wrong! Please try after some time.';
                    NotificationManager.error(msg);   
                }
            }).catch(error => {
                let msg = 'Something Wrong! Please try after some time.';
                NotificationManager.error(msg);    
            });
        }else{
            navigate("/login");
        }
    },[props,REACT_APP_API_URL,get_params,navigate]);
    
    
    let ChangeStatus = (val)=>{
        validateToken();
        const userInfo = getStorage('userInfo');
        if(userInfo && userInfo.token){
            setisStatusChange(true);
            let url = `${REACT_APP_API_URL}/users/update`;
            const params = {
                token : userInfo.token,
                id: dataGridRows.id,
                is_active:parseInt(val)
            }
            apiPut(url,params).then(response => {
                setisStatusChange(false);
                setDataGridRows(response.data.data)
                if(parseInt(response.data.code) === 200){
                    NotificationManager.success(response.data.message);
                }else{
                    NotificationManager.error(response.data.message);    
                }
            }).catch(error => {
                let msg = 'Something Wrong! Please try after some time.';
                NotificationManager.error(msg);   
                setisStatusChange(false);
            });
            
        }else{
            navigate("/login");
        }
    }
    const deleteWinner = userData => {
        validateToken();
        const userInfo = getStorage('userInfo');
        if(userInfo && userInfo.token){
          
          swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                let url = `${REACT_APP_API_URL}/CronScheduler/deleteOne`;
                const params = {
                    token: userInfo.token,
                    id : dataGridRows.id 
                }
                apiDelete(url,params).then(response => {
                    if(parseInt(response.data.code) === 200){
                    swal("Poof! Your user has been deleted!", {
                        icon: "success",
                        button: {
                            text: "OK",
                        }
                    }).then((value) => {
                        if(value){
                            navigate("/userwinners");
                        }
                    });
                    }else{
                    NotificationManager.error(response.data.message);
                    }
                }).catch(error => {
                    let msg = 'Response Error! Please try again later.';
                    NotificationManager.error(msg);
                });
            } else {
              swal("Your record is safe!");
            }
          });
        }else{
          navigate("/login");
        }
      }

    let validateAdmistModels = ()=>{
        validateToken();
    }  
    
  return (
    <>
        <Header />
        <NotificationContainer />
        <main className="main-content page-bg" id="main-content">
            <div className="box customer-info coutomerAccount-wrap">
                <h2>Scheduler Information </h2>
                <div className="ca-top d-flex justify-content-between">
                    <div className="ca-search"></div>
                    <div className="left">
                        <button className="fancybox btn-aid" data-bs-toggle="modal" data-bs-target="#addWinnerModal" onClick={SetShowModel}> Add Schedule </button>
                    </div>
                </div>
                <div className="ca-info">
                    <ul className="list-info white dv2 row mx-0">
                        <div className="col-sm-6 px-0">
                            <li className="row mx-0">
                                <div className="title col-4">ID:</div>
                                <div className="detail col-8">
                                    <span className="txt-orange"> { dataGridRows && (dataGridRows.id) !=="" ? dataGridRows.id : '-'} </span>
                                </div>
                            </li>
                            <li className="row mx-0">
                                <div className="title col-4">Reward Amount:</div>
                                <div className="detail col-8">{ dataGridRows && (dataGridRows.reward_amount) !== "" ? dataGridRows.reward_amount : '-'}</div>
                            </li>
                            <li className="row mx-0">
                                <div className="title col-4">How Many Winners ?:</div>
                                <div className="detail col-8"> { dataGridRows && (dataGridRows.how_many_winners) !== "" ? dataGridRows.how_many_winners : '-'} </div>
                            </li>
                            
                        
                            <li className="row mx-0">
                                <div className="title col-4">Cron Interval:</div>
                                <div className="detail col-8 txt-red"> { dataGridRows && (dataGridRows.cron_interval) !=="" ? dataGridRows.cron_interval : '-'} </div>
                            </li>
                            <li  className="row mx-0">
                                <div className="title col-4">Created at:</div>
                                <div className="detail col-8">{ dataGridRows && (dataGridRows.date_created) !=="" ? dataGridRows.date_created : '-'}</div>
                            </li>
                        </div>    
                        <div className="col-sm-6 px-0">

                            <li  className="row mx-0">
                                <div className="title col-4">Weekly Cron Time:</div>
                                <div className="detail col-8">{ dataGridRows && (dataGridRows.week_cron_time) !=="" ? dataGridRows.week_cron_time : '-'}</div>
                            </li>
                            <li  className="row mx-0">
                                <div className="title col-4">Weekly Cron Day:</div>
                                <div className="detail col-8">{ dataGridRows && (dataGridRows.week_cron_day) !=="" ? dataGridRows.week_cron_day : '-'}</div>
                            </li>
                            <li  className="row mx-0">
                                <div className="title col-4">Monthly Cron Time:</div>
                                <div className="detail col-8">{ dataGridRows && (dataGridRows.monthly_cron_time) !=="" ? dataGridRows.monthly_cron_time : '-'}</div>
                            </li>
                            <li  className="row mx-0">
                                <div className="title col-4">Monthly Cron Date:</div>
                                <div className="detail col-8">{ dataGridRows && (dataGridRows.monthly_cron_date) !=="" ? dataGridRows.monthly_cron_date : '-'}</div>
                            </li>
                           
                            <li  className="row mx-0">
                                <div className="title col-4">Status:</div>
                                <div className="detail col-8">{ dataGridRows && (dataGridRows.is_active) !=="" ? (dataGridRows.is_active === 1) ? 'Active' : 'Disable' : '-'}</div>
                            </li>

                            
                            
                        </div>  
                    </ul>
                    <br />  
                    <div className="btn-wrap d-flex justify-content-between">
                        <div className="left">
                            <button type="button" 
                            data-bs-toggle="modal" 
                            data-bs-target="#editWinnerModel" 
                            className='custom-btn'
                            onClick={() =>validateAdmistModels()} disabled={ dataGridRows && dataGridRows.id === undefined ? true : false}>Edit Schedule</button>&nbsp;
                        </div>
                        <div className='right'>
                            <button type="button" className="red custom-btn" onClick={deleteWinner} disabled={ dataGridRows && dataGridRows.id === undefined ? true : false}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            { winnerGet.length > 0 ?
            <div className='box2'>
                <h2>Winners </h2>
                <table id="choose_customer" className='table  table-bordered p-5'>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Reward Amount</th>
                        <th>Created at</th>   
                    </tr>
                    </thead>
                    <tbody>
                    {
                        winnerGet && winnerGet.map((item, index) => (
                            <tr key={item.id}> 
                                <td>{item.id}</td>
                                <td>{item.username}</td>
                                <td>{item.reward_amount}</td>
                                <td>{item.date_created}</td>
                            </tr>
                        )) 
                    }    
                    </tbody>
                </table>
            </div> :  <h2>No Winners Found.</h2>}
        </main>
        { dataGridRows ? 
        <>
            <AllModals userData={dataGridRows} showModel={showModel} />
        </> : '' }
    </>
  )
}
