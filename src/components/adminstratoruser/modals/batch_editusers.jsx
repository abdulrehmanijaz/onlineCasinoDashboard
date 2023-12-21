import React,{useState,useEffect} from 'react';
import 'react-notifications/lib/notifications.css';
import { useForm,useFieldArray  } from 'react-hook-form';
import { getStorage } from '../../../utilities/storage';
import { apiPut } from '../../../utilities/userAuth';
import { validateToken } from '../../../utilities/validateToken';

import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';


export default function BatchEditUsers(props) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit,setValue,reset,control, formState: { errors, isSubmitSuccessful } } = useForm({
    shouldFocusError: true,
    keepValues:true,
  });

  const {REACT_APP_API_URL} = process.env;
  
  useFieldArray({
    name: "user_info",
    control,
  });
  
  useEffect(
    () => {
      if(!isSubmitSuccessful){
        props.selectedRows.map((val, index)=>( 
          setValue(`user_info.${index}.`, { 
            user_id: val.id,
            name: val.name, 
            email: val.email, 
            username: val.username,
            mobile_id: val.mobile_id,
            driver_license: val.driver_license,
            birthday: val.birthday,
            gender: val.gender,
            phone: val.phone,
            role_id:val.role_id,
            is_verified:val.is_verified,
            is_active:val.is_active,
          })
        )); 
      }
    //validateToken();
  }, [isLoading,setValue,isSubmitSuccessful,props.selectedRows,props.setDataGridLoading]);
 
  const closePopup = () => {
    reset();
  }

  const onSubmit = (formData) =>{
    setIsLoading(true);
    
    let userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url = `${REACT_APP_API_URL}/users/batchupdate`;
      const params = {
        token : userInfo.token,
        batchdata:formData.user_info
      }
      apiPut(url,params).then(response => {
        setIsLoading(false);
        // props.setDataGridLoading(true)
        if(parseInt(response.data.code) === 200){
          props.setDataGridLoading(true)
          NotificationManager.success(response.data.message);
          var updated_rows = {};  
          var grid_rows = [];
          (formData.user_info).map((val) => {
            updated_rows = {
              id:val.user_id,
              name:val.name,
              username:val.username,
              is_status: parseInt(val.is_active) === 1 ? 'Active' : 'Suspend'
            }
            return grid_rows.push(updated_rows);
          })
          props.apiRef.current.updateRows(grid_rows);
          reset();
          document.getElementById("batch_edit_close").click();
         
        }else{
          NotificationManager.error(response.data.message);   
          
        }  
      }).catch(error => {
        let msg = 'Something Wrong! Please try after some time.';
        NotificationManager.error(msg);
       
      });

    }
  }  
  return (
    <>
      {/* { isLoading ? <Spinner/> : '' } */}
      <NotificationContainer/>
      <div className="modal fade" id="batchEditusers" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="batchEditusersLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="batchEditusersLabel">
                Batch Edit
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <form className="p-1" onSubmit={handleSubmit(onSubmit)} >
              <div className="modal-body">
                {
                  (props.selectedRows).length > 0 ?
                    
                    props.selectedRows.map((val, index)=>(  
                      <div>
                        <div className="alert alert-info p-2">
                          You are changing the user account for
                          <small>
                            <ul className="mt-2"> 
                              {val ? <li><strong>ID: </strong> {val.id} </li> : ''}
                              {val ? <li><strong>Customer Name: </strong> {val.name} </li> : ''}
                              {val ? <li><strong>Email: </strong> {val.email} </li> : ''}
                            </ul>
                          </small>
                        </div>  
                        <div className="clearfix">
                          <div className="row bg-white p-1 m-1">
                            <h6>Personal Details </h6>
                            <hr/>
                            <div className="form-group col-sm-6">
                              <label htmlFor="name">Name</label>
                              <input className="form-control" 
                                type="text" 
                                placeholder={val.name} 
                                {...register(`user_info.${index}.name`, {required: 'This field is required!'})} 
                              />
                              <p className='text-danger fs-7 p-1'>{errors.name?.message}</p>
                            </div>
                            <input type="hidden"  {...register(`user_info.${index}.user_id`)}/>
                            <div className="form-group col-sm-6">
                              <label htmlFor="email">Email</label>
                              <input className="form-control" 
                                type="text" 
                                placeholder={val.email} 
                                {...register(`user_info.${index}.email`, {required: 'This field is required!'})} 
                              readOnly/>
                              <p className='text-danger fs-7 p-1'>{errors.email?.message}</p>
                            </div>
                            <div className="form-group col-sm-12">
                              <label htmlFor="username">Username</label>
                              <input className="form-control" type="text" 
                              placeholder={val.username} 
                              {...register(`user_info.${index}.username`, {required: 'This field is required!'})} />
                              <p className='text-danger fs-7 p-1'>{errors.username?.message}</p>
                            </div>

                            <div className="form-group col-sm-6">
                              <label htmlFor="mobile_id">Mobile id</label>
                              <input className="form-control" 
                              type="text"  
                              placeholder={props.userData.mobile_id}
                              {...register(`user_info.${index}.mobile_id`, {required: 'This field is required!'})} 
                              />
                              <p className='text-danger fs-7 p-1'>{errors.mobile_id?.message}</p>
                            </div>
                            <div className="form-group col-sm-6">
                              <label htmlFor="driver_license">Driver license</label>
                              <input className="form-control" 
                              type="text"  
                              {...register(`user_info.${index}.driver_license`, {required: 'This field is required!'})} 
                              />
                              <p className='text-danger fs-7 p-1'>{errors.driver_license?.message}</p>
                            </div>
                            <div className="form-group col-sm-6">
                              <label htmlFor="birthday">Birthday</label>
                              <input className="form-control" 
                              type="date"  
                              {...register(`user_info.${index}.birthday`, {required: 'This field is required!'})} 
                              />
                              <p className='text-danger fs-7 p-1'>{errors.birthday?.message}</p>
                            </div>
                            <div className="form-group col-sm-6">
                              <label htmlFor="gender">Gender</label>
                              <input className="form-control" 
                              type="text"  
                              {...register(`user_info.${index}.gender`, {required: 'This field is required!'})} 
                              />
                              <p className='text-danger fs-7 p-1'>{errors.gender?.message}</p>
                            </div>
                            <div className="form-group col-sm-6">
                              <label htmlFor="phone">Phone</label>
                              <input className="form-control" 
                              type="text"  
                              {...register(`user_info.${index}.phone`, {required: 'This field is required!'})} 
                              />
                              <p className='text-danger fs-7 p-1'>{errors.phone?.message}</p>
                            </div>


                          </div>

                          <div className="row bg-white p-1 m-1">
                            <h6>Account Setting & Permissions </h6>
                            <hr/> 
                            <div className="form-group col-sm-6">
                              <label htmlFor="role_id">Permission</label>
                              <select className="form-select" 
                              {...register(`user_info.${index}.role_id`, {required: 'This field is required!'})} 
                              >
                                <option value="">Choose option</option>
                                <option value="2">Adminstrator</option>
                              </select>
                              <p className='text-danger fs-7 p-1'>{errors.role_id?.message}</p>
                            </div>

                            <div className="form-group col-sm-6">
                            <label htmlFor="is_verified">Is Verified?</label>
                            <select className="form-select" {
                              ...register(`user_info.${index}.is_verified`, {required: 'This field is required!'})} 
                            >
                              <option value="">Choose option</option>
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </select>
                            <p className='text-danger fs-7 p-1'>{errors.is_verified?.message}</p>
                            </div>
                            <div className="form-group col-sm-6">
                              <label htmlFor="is_active">Account Status</label>
                              <select className="form-select" 
                              {...register(`user_info.${index}.is_active`, {required: 'This field is required!'})} 
                              >
                                <option value="">Choose option</option>
                                <option value="1">Active</option>
                                <option value="0">Suspend</option>
                              </select>
                              <p className='text-danger fs-7 p-1'>{errors.is_active?.message}</p>
                            </div>
                          </div>
                        </div>
                      </div>  
                    ))
                  : 'No user found.'            
                }
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closePopup} className="btn bg-gradient-danger" data-bs-dismiss="modal" id="batch_edit_close">Cancel</button>
                <input type="submit" name="submit" className="btn bg-gradient-info" value={isLoading ? 'Loading...' : 'Update'} disabled={isLoading}  />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
