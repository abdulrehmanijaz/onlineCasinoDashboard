import React,{useState,useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/ModeEdit';
import { getStorage } from '../../../utilities/storage';
import { validateToken } from '../../../utilities/validateToken';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/spinner';
import { apiGet, apiPut, apiDelete } from '../../../utilities/userAuth';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import swal from 'sweetalert';

export default function GameEntriesModal(props) {
    
    const [isLoading, setIsLoading] = useState(false);
    const [gameEntries, setGameEntries] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const { register, handleSubmit,getValue,setValue,reset, formState: { errors } } = useForm({
      shouldFocusError: true,
      keepValues:true,
    });
    const {REACT_APP_API_URL} = process.env;
    useEffect( () => {
      
      if(props.userData.id >  0){
        validateToken();
        getGameEntries();
      }
      
    },[props]);
    
    const closePopup = () => {
    
    }

    const getGameEntries = () => {
      setIsLoading(true);
      let userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        let url = `${REACT_APP_API_URL}/gameEntries/getByUserId`;
        const params = {
          token: userInfo.token,
          user_id: props.userData.id
        }
        apiGet(url,params).then(response => {
          setIsLoading(false);
          if(parseInt(response.data.code) === 200){
            setGameEntries(response.data.data);
          }
        }).catch(error => {
          let msg = 'Response Error! Please try again later.';
          NotificationManager.error(msg);
        });
      }else{
        window.location('/login');
      }
    }

    const deleteEntry = (entry_id) =>{
      setIsLoading(true);
      let userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        
        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this record!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let url = `${REACT_APP_API_URL}/gameEntries/deleteOne`;
            const params = {
              token: userInfo.token,
              id: entry_id
            }
            apiDelete(url,params).then(response => {
              setIsLoading(false);
              if(parseInt(response.data.code) === 200){
                swal(response.data.message, {
                  icon: "success",
                });
                //NotificationManager.success(response.data.message);
                getGameEntries();
              }
            }).catch(error => {
              let msg = 'Response Error! Please try again later.';
              NotificationManager.error(msg);
            });
            
          } else {
            swal("Your record is safe!");
            setIsLoading(false);
          }
        });
       
      }else{
        window.location('/login');
      }
    }

    const cancelUpdate = () => {
      setIsUpdated(false);
      reset();
    }
    
    const editWinning = (entry) => {
      setIsUpdated(true);
      setValue('entry_id',entry.id);
      setValue('game_name',entry.game_name);
      setValue('entry_count',entry.entry_count);
      setValue('expiry',entry.expiry);
    }

    const onSubmit = (formData) =>{
      setIsLoading(true);
      let userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        let url = `${REACT_APP_API_URL}/gameEntries/update`;
        const params = {
          token : userInfo.token,
          id: formData.entry_id,
          entry_count: formData.entry_count,
          expiry: formData.expiry,
        }
        apiPut(url,params).then(response => {
          setIsLoading(false);
          if(parseInt(response.data.code) === 200){
            NotificationManager.success(response.data.message);
            reset();
            getGameEntries();
            setIsUpdated(false);
          }else{
            NotificationManager.error(response.data.message);    
          }
        }).catch(error => {
          let msg = 'Something Wrong! Please try after some time.';
          NotificationManager.error(msg);   
        });
      }else{
        window.location.href = "/login";
      }
    }
    return (
      <>
        {/* { isLoading ? <Spinner/> : '' } */}
        <NotificationContainer/>
        <div className="modal fade" id="gameEntriesModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="gameEntriesModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="gameEntriesModalLabel">
                  {props.gameEntries}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info p-2">
                  Game entries for user  
                  <small>
                    <ul className="mt-2">
                      {props.userData ? <li><strong>ID: </strong> {props.userData.id} </li> : ''}
                      {props.userData ? <li><strong>Customer Name: </strong> {props.userData.name} </li> : ''}
                      {props.userData ? <li><strong>Email: </strong> {props.userData.email} </li> : ''}
                    </ul>
                  </small>
                </div>
                <div className="col-lg-12">
                  <br/>
                  <div className="row">
                    <div className="col-6 text-start">
                      <h5>Active Entries</h5>
                    </div>
                    <div className="clearfix">
                      <form className="p-1" action="" onSubmit={ handleSubmit(onSubmit) }>
                        {isUpdated === true ? 
                        <div className="row card-header p-3">
                          <h6>Update Game Entry</h6>
                          <input className="form-control" type="hidden" id="entry_id" {...register("entry_id", {required: 'This field is required!'})} />
                          <div className="form-group col-sm-4">
                            <label htmlFor="game_name">Game Name</label>
                            <input disabled="disabled" className="form-control" type="text" id="game_name" {...register("game_name", {required: 'This field is required!'})} />
                            <p className='text-danger fs-7 p-1'>{errors.game_name?.message}</p>
                          </div>
                          <div className="form-group col-sm-4">
                            <label htmlFor="entry_count">Entry Count</label>
                            <input className="form-control" type="number" id="entry_count" {...register("entry_count", {required: 'This field is required!'})} />
                            <p className='text-danger fs-7 p-1'>{errors.entry_count?.message}</p>
                          </div>
                          <div className="form-group col-sm-4">
                              <label htmlFor="expiry">Expiry</label>
                              <input className="form-control" type="date" id="expiry" {...register("expiry", {required: 'This field is required!'})} />
                              <p className='text-danger fs-7 p-1'>{errors.expiry?.message}</p>
                          </div>
                          <div className="form-group col-sm-4">
                            <button type="button" onClick={cancelUpdate} className="btn bg-gradient-danger">Cancel</button>
                            &nbsp;
                            <input type="submit" name="submit" id="submit" className="btn bg-gradient-info" value={isLoading ? 'Loading...' : 'Update'} disabled={isLoading}  />
                          </div>
                        </div>
                        : '' }
                      </form>
                    </div>
                  </div>
                  <table className="table table-sm table-hover">
                    <thead className="thead-light">
                      <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Game Name</th>
                      <th scope="col">Entry Count</th>
                      <th scope="col">Expiry</th>
                      <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameEntries && gameEntries.map((entry, index) => (
                        <tr data-index="">
                          <th scope="row">{entry.id + 1}</th>
                          <td>
                            <div className="clearfix">
                              {entry.game_name}
                            </div>
                          </td>
                          <td>{entry.entry_count}</td>
                          <td>{entry.expiry}</td>
                          <td>
                            <NavLink className="" to="/users" onClick={ e => editWinning(entry) }><EditIcon/></NavLink>
                            &nbsp;
                            <NavLink className="" to="/users" onClick={ e => deleteEntry(entry.id) }><DeleteIcon/></NavLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closePopup} className="btn bg-gradient-danger" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }