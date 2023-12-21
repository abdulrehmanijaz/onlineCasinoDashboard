import React,{useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/spinner';
import { getStorage } from '../../../utilities/storage';
import { apiPost,apiGet } from '../../../utilities/userAuth';
import { validateToken } from '../../../utilities/validateToken';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import 'react-notifications/lib/notifications.css';
import ArrowIcon from '../../../assets/images/spinner-arrow.svg'
import Chart from 'chart.js/auto'
import {useNavigate    } from "react-router";

import ChartDataLabels from 'chartjs-plugin-datalabels';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import WheelComponent from '../modals/spin_wheel'

export default function AddWinnerModel(props) {

  const [isLoading, setIsLoading] = useState(false);
  const [segments, setDySegments] = useState([]);
  const [segColors, setsegColors] = useState([]);
  const [responseData,setResponseData] = useState([]);
  const [winnerInfoDetails,setWinnerInfoDetails] = useState([]);
  const navigate = useNavigate();
  const {REACT_APP_API_URL} = process.env;
  useEffect( ()=>{
    if(props.showModel){
      getUsers();
    }
  },[props]);

  const getUsers = () => {
    validateToken();
    setIsLoading(true);
    const userInfo = getStorage('userInfo');
    if(userInfo ){
      let url = `${REACT_APP_API_URL}/users/getAll`;
      const params = {
        token: userInfo.token,
        is_active: 1, // active only
        role_id:1
      }
      apiGet(url,params).then(response => {
        if(response.data.code === 200){
          setIsLoading(false);
          var colors = [];
          setResponseData(response.data.data)
          while (colors.length < response.data.data.length) {
            do {
              var color = Math.floor((Math.random()*1000000)+1);
            } while (colors.indexOf(color) >= 0);
            colors.push("#" + ("000000" + color.toString(16)).slice(-6));
          }
          let get_user_data = response.data.data;
          var users_spinner = [];
          for(let i=0;i<get_user_data.length;i++){
            users_spinner.push(get_user_data[i].mobile_id);
          }
          setsegColors(colors);
          setDySegments(users_spinner);
          
          
        }else{
          setIsLoading(false);
        }
      }).catch(error => {
        setIsLoading(false);
      });
    }else{
      setIsLoading(false);
    }
  }

 
  const onFinished = (winner) => {
    //console.log(winner)
    var winner_info = [];
    for(let i=0; i<responseData.length;i++){
      if((responseData[i].mobile_id).toString() === (winner).toString()){
        winner_info.push(responseData[i])
      }
    }
    
    setWinnerInfoDetails(winner_info[0]);
    const userInfo = getStorage('userInfo');
    
    let url = `${REACT_APP_API_URL}/UserWinner/spinUser`;
      const params = {
        token : userInfo.token,
        id:parseInt(winner_info[0].id),
        reward_amount:10,
        is_approved:1,
        is_active:1
      }
    apiPost(url,params).then(response => {
      if(response.data.code === 200){ 
        setTimeout(function(){
          document.getElementById("close_addwinning").click(); 
          navigate('/userwinnersinfo/'+response.data.data.winning_entry.id)
        },1000) 
      }
    }).catch(error => {
      let msg = 'Something Wrong! Please try after some time.';
      NotificationManager.error(msg);
    });  
  }
  

  const closePopup = () => {
   
  }
  
    return (
      <>
       { isLoading ? <Spinner/> : '' }
        <NotificationContainer/>
        <div className="modal fade" id="addWinnerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addWinnerModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button type="buttonn" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <div className='wraper_parent_wheel'>
                { !isLoading ?
                <WheelComponent
                  segments={segments}
                  segColors={segColors}
                  onFinished={(winner) => onFinished(winner)}
                  primaryColor='black'
                  contrastColor='white'
                  buttonText='Spin'
                  isOnlyOnce={false}
                  size={290}
                  upDuration={100}
                  downDuration={100}
                  fontFamily='Arial'
                />
                                
              : ''}
                <div className="ca-info-winner">
                  <ul className="nav-winner">
                    <li>
                      <div className="title"><b>Reward Amount:</b></div>&nbsp;
                      <div className="detail">
                        <span className="txt-orange">$10</span>
                      </div>
                    </li>
                    <li>
                      <div className="title"><b>Name:</b></div>&nbsp;
                      <div className="detail">
                        <span className="txt-orange">{winnerInfoDetails.username}  </span>
                      </div>
                    </li>
                    <li>
                      <div className="title"><b>Email:</b></div>&nbsp;
                      <div className="detail">
                        <span className="txt-orange">{winnerInfoDetails.email}  </span>
                      </div>
                    </li>
                    <li>
                      <div className="title"><b>Mobile ID:</b></div>&nbsp;
                      <div className="detail">
                        <span className="txt-orange">{winnerInfoDetails.mobile_id}  </span>
                      </div>
                    </li>
                  </ul> 
                </div>  
              </div>						
              
              
                {/* <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-body">
                    <div className="clearfix">
                      <div className="row bg-white p-1 m-1">
                        <div className="form-group col-sm-6">
                          <label htmlFor="user_id">Choose Creator/User</label>
                          <select className="form-select" id="user_id" {...register("user_id", {required: 'This field is required!'})} >
                            <option value="">Choose option</option>
                            {allUsers && allUsers.map(({ name,id }, index) => <option value={id} >{name}</option>)}
                          </select>
                          <p className='text-danger fs-7 p-1'>{errors.user_id?.message}</p>
                        </div>
                        <div className="form-group col-sm-6">
                          <label htmlFor="game_id">Choose Game</label>
                          <select className="form-select" id="game_id" {...register("game_id", {required: 'This field is required!'})} >
                            <option value="">Choose option</option>
                            {allGames && allGames.map(({ name,id }, index) => <option value={id} >{name}</option>)}
                          </select>
                          <p className='text-danger fs-7 p-1'>{errors.game_id?.message}</p>
                        </div>
                        <div className="form-group col-sm-6">
                          <label htmlFor="reward_amount	">Reward Amount	</label>
                          <input className="form-control" type="text" id="reward_amount" {...register("reward_amount", {required: 'This field is required!'})} />
                          <p className='text-danger fs-7 p-1'>{errors.reward_amount?.message}</p>
                        </div>
                        <div className="form-group col-sm-6">
                          <label htmlFor="expiry">Expiry</label>
                          <input className="form-control" type="date" id="expiry" {...register("expiry", {required: 'This field is required!'})} />
                          <p className='text-danger fs-7 p-1'>{errors.expiry?.message}</p>
                        </div>
                        <div className="form-group col-sm-6">
                          <label htmlFor="is_approved">Approve/Not</label>
                          <select className="form-select" id="is_approved" {...register("is_approved", {required: 'This field is required!'})} >
                            <option value="">Choose option</option>
                            <option value="1">Approved</option>
                            <option value="0">Not Approved</option>
                          </select>
                          <p className='text-danger fs-7 p-1'>{errors.is_approved?.message}</p>
                        </div>
                        <div className="form-group col-sm-6">
                          <label htmlFor="is_active">Status</label>
                          <select className="form-select" id="is_active" {...register("is_active", {required: 'This field is required!'})} >
                            <option value="">Choose option</option>
                            <option value="1">Active</option>
                            <option value="0">Disable</option>
                          </select>
                          <p className='text-danger fs-7 p-1'>{errors.is_active?.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                <div className="modal-footer">
                  <button type="button" onClick={closePopup} id="close_addrating" className="btn bg-gradient-danger" data-bs-dismiss="modal">Cancel</button>
                  <input type="submit" name="submit" id="submit" className="btn bg-gradient-info" value={isLoading ? 'Loading...' : 'Submit'} disabled={isLoading}  />
                </div>
                </form> */}
                <div className="modal-footer">
                  <button type="button" onClick={closePopup} id="close_addwinning" className="btn bg-gradient-danger" data-bs-dismiss="modal">Cancel</button>
                  <input type="submit" name="submit" id="submit" className="btn bg-gradient-info"  />
                </div>
            </div>
          </div>
        </div>
      </>
    );
  }