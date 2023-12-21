import React,{useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate    } from "react-router";
import { getStorage } from '../../../utilities/storage';
import { apiPost } from '../../../utilities/userAuth';
import { validateToken } from '../../../utilities/validateToken';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';

export default function ChangePasswordModal(props) {  
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit,reset, formState: { errors } } = useForm({
    shouldFocusError: true,
    keepValues:true,
  });
  const {REACT_APP_API_URL} = process.env;

  const closePopup = () => {
    reset();
  }


  const navigate = useNavigate();

  const onSubmit = (formData) =>{
    validateToken()
    setIsLoading(true);
    let userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/users/update`;
      const params = {
        token : userInfo.token,
        id: props.userData.id,
        password: formData.password
      }
      if(formData.password === formData.confirmPassword){
        apiPost(url,params).then(response => {
          setIsLoading(false);    
          reset();
          document.getElementById("resetPasswordClose").click();
          if(response.data.code === 200){    
            NotificationManager.success(response.data.message);
          }else{
            NotificationManager.error(response.data.message);
          }
        }).catch(error => {
          reset();
          let msg = 'Something Wrong! Please try after some time.';
          NotificationManager.error(msg);    
        });
      }else{
        setIsLoading(false);    
        reset();
        let msg = "Password doesn't match, please try again.";
        NotificationManager.error(msg);
      }
    }else{
      navigate('/login');
    }
  }
   
    return (
      <>
        {/* { isLoading ? <Spinner/> : '' } */}
        <NotificationContainer/>
        <div className="modal fade" id="changePasswordModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="changePasswordModalLabel">
                  {props.changePassword}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="alert alert-danger p-2">
                    You are changing the password for account 
                    <small>
                      <ul className="mt-2">
                        {props.userData ? <li><strong>ID: </strong> {props.userData.id} </li> : ''}
                        {props.userData ? <li><strong>Customer Name: </strong> {props.userData.name} </li> : ''}
                        {props.userData ? <li><strong>Email: </strong> {props.userData.email} </li> : ''}
                      </ul>
                    </small>
                  </div>
                  <div className="clreafix">
                    <div className="form-floating mt-2">
                      <input className="form-control" type="password" {...register("password", {required: 'This field is required!'})} />
                      <label htmlFor="password">Password</label>
                      <p className='text-danger fs-7 p-1'>{errors.password?.message}</p>
                    </div>
                    <div className="form-floating mt-2">
                      <input className="form-control" type="password" {...register("confirmPassword", {required: 'This field is required!'})} />
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <p className='text-danger fs-7 p-1'>{errors.confirmPassword?.message}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={closePopup} className="btn bg-gradient-danger" id="resetPasswordClose" data-bs-dismiss="modal">Cancel</button>
                  <input type="submit" name="submit" className="btn bg-gradient-info" value={isLoading ? 'Loading...' : 'Update'} disabled={isLoading}  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }