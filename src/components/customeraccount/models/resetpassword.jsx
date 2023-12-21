import React,{useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/spinner';
import { getStorage } from '../../../utilities/storage';
import { apiPut,apiPost } from '../../../utilities/userAuth';
import { validateToken } from '../../../utilities/validateToken';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';

export default function Resetpassword(props) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit,reset, formState: { errors } } = useForm({
      shouldFocusError: true,
      keepValues:true,
    });
    const {REACT_APP_API_URL} = process.env;
    
    const closePopup = () => {
      reset();
    }
  
    const onSubmit = (formData) =>{
      setIsLoading(true);
      validateToken();
      let userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        let url = `${REACT_APP_API_URL}/users/update`;
        const params = {
          token : userInfo.token,
          id: props.dataGridRows.id,
          password: formData.password
        }
        if(formData.password === formData.confirmPassword){
          apiPost(url,params).then(response => {
            setIsLoading(false);    
            reset();
            if(response.data.code === 200){    
              NotificationManager.success(response.data.message);
              document.getElementById("resetPasswordClose").click();
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
        window.location('/login');
      }
    }
  return (
    <>
        <NotificationContainer/>
        <div class="modal fade big-modal" id="resetPassword" tabindex="-1" aria-labelledby="resetPasswordLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content position-relative">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
                        <div class="modal-body">
                            <div class="alert alert-danger p-2">You are changing the password for account <small>
                                <ul class="mt-2">
                                {props.dataGridRows ? <li><strong>ID: </strong> {props.dataGridRows.id} </li> : ''}
                                {props.dataGridRows ? <li><strong>Customer Name: </strong> {props.dataGridRows.name} </li> : ''}
                                {props.dataGridRows ? <li><strong>Email: </strong> {props.dataGridRows.email} </li> : ''}
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
                                <input type="button" onClick={closePopup} className="btn btn-danger" id="resetPasswordClose" data-bs-dismiss="modal" value='Cancel'/>
                                <input type="submit" name="submit" className="btn btn-primary" value={isLoading ? 'Loading...' : 'Update'} disabled={isLoading}  />
                            </div>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

