import React,{useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/spinner';
import { getStorage } from '../../../utilities/storage';
import { apiPut,apiGet } from '../../../utilities/userAuth';
import { validateToken } from '../../../utilities/validateToken';
import { useParams,useNavigate    } from "react-router";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';

export default function EditRatingsModal(props) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const { register, handleSubmit,setValue,reset, formState: { errors, isSubmitSuccessful } } = useForm({
    shouldFocusError: true,
    keepValues:true,
  });

  const {REACT_APP_API_URL} = process.env;
  useEffect(
    () => {
      if(!isSubmitSuccessful){
        setValue('user_id',props.userData.user_id);
        setValue('game_id',props.userData.game_id);
        setValue('winning_count',props.userData.winning_count);
        setValue('rating',props.userData.rating);
        setValue('is_active',(props.userData.is_active === 'Active')? '1':'0');
      }
      
      getUsers();
      getGames();
    },[props]
  );

  const closePopup = () => {
    //reset();
  }
  const navigate = useNavigate();
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

  const onSubmit = (formData) =>{
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/UserRatings/update`;
      const params = {
        token : userInfo.token,
        id: props.userData.id,
        user_id: formData.user_id,
        game_id: formData.game_id,
        winning_count: formData.winning_count,
        rating:formData.rating,
        is_active: formData.is_active,
      }
      apiPut(url,params).then(response => {
        setIsLoading(false);
        if(parseInt(response.data.code) === 200){    
          NotificationManager.success(response.data.message);
          setValue('user_id',formData.user_id);
          setValue('game_id',formData.game_id);
          setValue('winning_count',formData.winning_count);
          setValue('winning_count',formData.rating);
          setValue('is_active',formData.is_active);
        }else{
          NotificationManager.error(response.data.message);    
        }
        document.getElementById("close_editrating").click();
        navigate('/rating/'+props.userData.id)
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
        <div className="modal fade" id="editRatingsModel" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editRatingsModelLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editRatingsModelLabel">
                  {props.editRatings}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="alert alert-info p-2">
                  You are changing the
                  <small>
                    <ul className="mt-2">
                      {props.userData ? <li><strong>ID: </strong> {props.userData.id} </li> : ''}
                      {props.userData ? <li><strong>Name: </strong> {props.userData.username} </li> : ''}
                    </ul>
                  </small>
                </div>
                <div className="clearfix">
                    <div className="row bg-white p-1 m-1">
                      <div className="form-group col-sm-6">
                        <label htmlFor="user_id">Choose Creator/User</label>
                        <select className="form-select" id="user_id" {...register("user_id", {required: 'This field is required!'})} >
                          <option value="">Chose option</option>
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
                        <label htmlFor="winning_count">Winning Count</label>
                        <input className="form-control" type="text" id="winning_count" {...register("winning_count", {required: 'This field is required!'})} />
                        <p className='text-danger fs-7 p-1'>{errors.winning_count?.message}</p>
                      </div>
                      <div className="form-group col-sm-6">
                        <label htmlFor="rating">Rating</label>
                        <input className="form-control" type="text" id="rating" {...register("rating", {required: 'This field is required!'})} />
                        <p className='text-danger fs-7 p-1'>{errors.rating?.message}</p>
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