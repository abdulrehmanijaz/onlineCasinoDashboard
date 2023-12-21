import React,{useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/spinner';
import { getStorage } from '../../../utilities/storage';
import { apiPut,apiGet } from '../../../utilities/userAuth';
import { validateToken } from '../../../utilities/validateToken';
import {useNavigate    } from "react-router";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';

export default function EditWinnerModal(props) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [checkCronType,setCheckCronType]=useState('weekly')
  const { register, handleSubmit,setValue,reset, formState: { errors, isSubmitSuccessful } } = useForm({
    shouldFocusError: true,
    keepValues:true,
  });
  const navigate = useNavigate();
  const {REACT_APP_API_URL} = process.env;
  useEffect(
    () => {
      if(!isSubmitSuccessful){
        setValue('reward_amount',props.userData.reward_amount);
        setValue('how_many_winners',props.userData.how_many_winners);
        setValue('reward_amount',props.userData.reward_amount);
        setValue('cron_interval',props.userData.cron_interval);

        setValue('week_cron_time',props.userData.week_cron_time);
        setValue('week_cron_day',props.userData.week_cron_day);

        setValue('monthly_cron_time',props.userData.monthly_cron_time);
        setValue('monthly_cron_date',props.userData.monthly_cron_date);
       
        setValue('is_active',props.userData.is_active);
      }
     
      getUsers();
      
    },[props]
  );

  const closePopup = () => {
    reset();
  }

  const getUsers = () => {
    // setIsLoading(true);
    const userInfo = getStorage('userInfo');
    if(userInfo ){
      let url = `${REACT_APP_API_URL}/users/getAll`;
      const params = {
        token: userInfo.token,
        is_active: 1 // active only
      }
      apiGet(url,params).then(response => {
        if(response.data.code === 200){
          // setIsLoading(false);
          setAllUsers(response.data.data);
        }else{
          // setIsLoading(false);
        }
      }).catch(error => {
        setIsLoading(false);
      });
    }else{
      setIsLoading(false);
    }
  }

  const getGames = () => {
    // setIsLoading(true);
    const userInfo = getStorage('userInfo');
    if(userInfo ){
      let url = `${REACT_APP_API_URL}/games/getAll`;
      const params = {
        token: userInfo.token,
        // is_active: 1 // active only
      }
      apiGet(url,params).then(response => {
        if(response.data.code === 200){
          // setIsLoading(false);
          setAllGames(response.data.data);
        }else{
          // setIsLoading(false);
        }
      }).catch(error => {
        setIsLoading(false);
      });
    }else{
      setIsLoading(false);
    }
  }
  const handleChange = (e) =>{
    // setAvailableBalance('')
    const idx = e.target.value;
    setCheckCronType(idx)
    setValue('week_cron_time','');
    setValue('week_cron_day','');
    setValue('monthly_cron_time','');
    setValue('monthly_cron_date','');
  }
  const onSubmit = (formData) =>{
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/CronScheduler/update`;
      const params = {
        token : userInfo.token,
        id: props.userData.id,
        // user_id: userInfo.user_info.id,
        // game_id: formData.game_id,
        reward_amount: formData.reward_amount,
        how_many_winners: formData.how_many_winners,
        cron_interval: formData.cron_interval,
        week_cron_time: formData.week_cron_time,
        week_cron_day: formData.week_cron_day,
        monthly_cron_time: formData.monthly_cron_time,
        monthly_cron_date: formData.monthly_cron_date,
        is_active: formData.is_active,
      }
      apiPut(url,params).then(response => {
        setIsLoading(false);
        document.getElementById("close_editrating").click();  
        if(parseInt(response.data.code) === 200){    
          NotificationManager.success(response.data.message);
          setValue('reward_amount',formData.reward_amount);
          setValue('how_many_winners',formData.how_many_winners);
          setValue('reward_amount',formData.reward_amount);
          setValue('cron_interval',formData.cron_interval);

          setValue('week_cron_time',formData.week_cron_time);
          setValue('week_cron_day',formData.week_cron_day);

          setValue('monthly_cron_time',formData.monthly_cron_time);
          setValue('monthly_cron_date',formData.monthly_cron_date);
        
          setValue('is_active',formData.is_active);
          
          navigate('/userwinnersinfo/'+props.userData.id)
        }else{
          NotificationManager.error(response.data.message);    
        }
        
      }).catch(error => {
        let msg = 'Something Wrong! Please try after some time.';
        NotificationManager.error(msg);   
      });
    }else{
      navigate('/login');
    }
  }
   
    return (
      <>
        { isLoading ? <Spinner/> : '' }
        <NotificationContainer/>
        <div className="modal fade" id="editWinnerModel" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editWinnerModelLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editWinnerModelLabel">
                  {props.Loan}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">

                    <div className="form-group col-sm-6">
                      <label htmlFor="reward_amount	">Reward Amount	</label>
                      <input className="form-control" type="text" id="reward_amount" {...register("reward_amount", {required: 'This field is required!'})} />
                      <p className='text-danger fs-7 p-1'>{errors.reward_amount?.message}</p>
                    </div>

                    <div className="form-group col-sm-6">
                      <label htmlFor="how_many_winners">How Many Winners?</label>
                        <input className="form-control" 
                        type="number" 
                        id="how_many_winners" 
                        {...register("how_many_winners", {required: 'This field is required!'})} 
                        min={1}
                        max={allUsers.length}
                        />
                      <p className='text-danger fs-7 p-1'>{errors.total_winner?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="interval_cron">Interval</label>
                      <select className="form-select" id="interval_cron" 
                      {...register("cron_interval", {required: 'This field is required!'})} 
                      onChange={(e) => handleChange(e)}>
                        <option value="">Choose option</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                      </select>
                      <p className='text-danger fs-7 p-1'>{errors.interval_cron?.message}</p>
                    </div>
                    {checkCronType === 'monthly' ? 
                      <div className='row'>
                        <div className="form-group col-sm-6">
                          <label htmlFor="monthly_cron_date">Date:</label>
                          <input type="date" className="form-control" 
                          name="monthly_cron_date" 
                          id="monthly_cron_date" 
                          {...register("monthly_cron_date", {required: 'This field is required!'})} />
                          <p className='text-danger fs-7 p-1'>{errors.monthly_cron_date?.message}</p>
                        </div>
                        <div className="form-group col-sm-6">
                          <label htmlFor="monthly_cron_time">Time:</label>
                          <input type="time" className="form-control" 
                          name="monthly_cron_time" 
                          id="monthly_cron_time" 
                          {...register("monthly_cron_time", {required: 'This field is required!'})} />
                          <p className='text-danger fs-7 p-1'>{errors.monthly_cron_time?.message}</p>
                        </div>
                      </div>  
                      : (
                      <div className='row'>
                        <div className="form-group col-sm-6">
                          <label htmlFor="week_cron_day">Day:</label>
                          <select className="form-select" id="week_cron_day" 
                            {...register("week_cron_day", {required: 'This field is required!'})} 
                          >
                            <option value="">Choose Day</option>
                            <option value="saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                          </select>
                          
                          <p className='text-danger fs-7 p-1'>{errors.week_cron_day?.message}</p>
                        </div>

                        <div className="form-group col-sm-6">
                          <label htmlFor="week_cron_time">Time:</label>
                          <input type="time" className="form-control" 
                          name="week_cron_time" 
                          id="week_cron_time" 
                          {...register("week_cron_time", {required: 'This field is required!'})} />
                          <p className='text-danger fs-7 p-1'>{errors.week_cron_time?.message}</p>
                        </div>
                      </div> ) }
                      
                      
                    <div className="form-group col-sm-6">
                      <label htmlFor="is_active">Cron Status</label>
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
                  <button type="button" onClick={closePopup} id="close_editrating" className="btn bg-gradient-danger" data-bs-dismiss="modal">Cancel</button>
                  <input type="submit" name="submit" id="submit" className="btn bg-gradient-info" value={isLoading ? 'Loading...' : 'Update'} disabled={isLoading}  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }